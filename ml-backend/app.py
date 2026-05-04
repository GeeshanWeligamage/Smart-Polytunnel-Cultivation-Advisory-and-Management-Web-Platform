from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import xgboost as xgb
import os
from datetime import datetime, timedelta

app = Flask(__name__)
# Enable CORS to allow API requests from the React frontend
CORS(app)

# Feature Engineering logic MUST exactly match the training phase
def create_features(df):
    df = df.copy()
    df['year'] = df['ds'].dt.year
    df['month'] = df['ds'].dt.month
    df['day'] = df['ds'].dt.day
    df['dayofweek'] = df['ds'].dt.dayofweek
    df['dayofyear'] = df['ds'].dt.dayofyear
    return df

FEATURES = ['year', 'month', 'day', 'dayofweek', 'dayofyear']

def load_xgb_model(crop_name, price_type):
    """
    Loads the saved XGBoost JSON model for the specific crop and price type.
    """
    safe_crop_name = str(crop_name).strip().replace(" ", "_").lower()
    model_path = f"{safe_crop_name}_xgb_{price_type}.json"
    
    if not os.path.exists(model_path):
        return None
        
    model = xgb.XGBRegressor()
    model.load_model(model_path)
    return model

# -------------------------------------------------------------------
# 1. DAILY PRICE PREDICTION API (7 Days)
# -------------------------------------------------------------------
@app.route('/api/predict_price', methods=['GET'])
def predict_price():
    crop = request.args.get('crop')
    days = int(request.args.get('days', 7)) # Predict for the next 7 days by default
    
    if not crop:
        return jsonify({"error": "Crop name is required!"}), 400
        
    # Load both minimum and maximum price models
    model_min = load_xgb_model(crop, 'min')
    model_max = load_xgb_model(crop, 'max')
    
    if not model_min or not model_max:
         return jsonify({"error": f"XGBoost models for '{crop}' not found! Please train the models first."}), 404

    # Generate future dates starting from today
    base_date = pd.to_datetime('today') 
    date_list = [base_date + timedelta(days=x) for x in range(1, days + 1)]
    
    future_df = pd.DataFrame({'ds': date_list})
    
    # Process dates into numerical features for XGBoost
    future_features = create_features(future_df)[FEATURES]
    
    # Predict future prices
    min_predictions = model_min.predict(future_features)
    max_predictions = model_max.predict(future_features)
    
    results = []
    for i in range(days):
        # Extract the raw predictions
        pred1 = round(float(min_predictions[i]), 2)
        pred2 = round(float(max_predictions[i]), 2)
        
        # Smart Hack: Ensure min is always the smaller value and max is the larger value
        final_min = min(pred1, pred2)
        final_max = max(pred1, pred2)
        
        results.append({
            "date": date_list[i].strftime('%Y-%m-%d'),
            "predicted_min_price": final_min,
            "predicted_max_price": final_max
        })
        
    return jsonify({
        "crop": crop.capitalize(),
        "predictions": results
    })

# -------------------------------------------------------------------
# 2. INCOME CALCULATOR API ROUTE
# Calculates exact future harvest dates and predicts income based on 
# real agricultural yield data and XGBoost price predictions.
# -------------------------------------------------------------------
@app.route('/api/prices/calculate-income', methods=['POST'])
def calculate_income():
    try:
        data = request.get_json()
        crop_name = data.get('cropName')
        num_plants = int(data.get('numberOfPlants', 0))
        plant_date_str = data.get('plantDate')

        if not crop_name or not plant_date_str or num_plants <= 0:
            return jsonify({"message": "Invalid input data provided."}), 400

        plant_date = datetime.strptime(plant_date_str, '%Y-%m-%d')
        harvest_plan = []
        
        # ---------------------------------------------------------------
        # CAPSICUM LOGIC
        # ---------------------------------------------------------------
        if crop_name == "Capsicum":
            h1_date = plant_date + timedelta(days=45)
            end_date = h1_date + timedelta(days=120) 
            current_date = h1_date
            harvest_count = 1

            while current_date <= end_date and harvest_count <= 30:
                if harvest_count == 1:
                    yield_g = 50
                elif harvest_count == 2:
                    yield_g = 50
                elif harvest_count == 3:
                    yield_g = 150
                else:
                    yield_g = 200
                
                yield_kg = (yield_g * num_plants) / 1000.0
                harvest_plan.append({'date': current_date, 'yield_kg': yield_kg})
                
                if harvest_count == 1:
                    current_date += timedelta(days=7)
                elif harvest_count == 2:
                    current_date += timedelta(days=7)
                else:
                    if harvest_count % 2 != 0: 
                        current_date += timedelta(days=4)
                    else:                      
                        current_date += timedelta(days=3)
                
                harvest_count += 1

        # ---------------------------------------------------------------
        # CUCUMBER LOGIC
        # ---------------------------------------------------------------
        elif crop_name == "Cucumber":
            h1_date = plant_date + timedelta(days=30)
            end_date = h1_date + timedelta(days=90)
            current_date = h1_date
            harvest_count = 1

            while current_date <= end_date:
                if harvest_count == 1:
                    yield_g = 400
                else:
                    yield_g = 600
                
                yield_kg = (yield_g * num_plants) / 1000.0
                harvest_plan.append({'date': current_date, 'yield_kg': yield_kg})
                
                current_date += timedelta(days=7)
                harvest_count += 1

        # ---------------------------------------------------------------
        # TOMATO LOGIC
        # ---------------------------------------------------------------
        elif crop_name == "Tomato":
            h1_date = plant_date + timedelta(days=30)
            end_date = h1_date + timedelta(days=90)
            current_date = h1_date
            harvest_count = 1

            while current_date <= end_date:
                if harvest_count == 1:
                    yield_g = 200
                else:
                    yield_g = 250
                
                yield_kg = (yield_g * num_plants) / 1000.0
                harvest_plan.append({'date': current_date, 'yield_kg': yield_kg})
                
                current_date += timedelta(days=3)
                harvest_count += 1
        
        else:
            return jsonify({"message": f"Agricultural data for {crop_name} is not configured yet."}), 400

        # ---------------------------------------------------------------
        # XGBOOST PRICE PREDICTION INTEGRATION
        # ---------------------------------------------------------------
        if not harvest_plan:
            return jsonify({"message": "Could not generate harvest plan."}), 400

        harvest_dates = [item['date'] for item in harvest_plan]
        future_df = pd.DataFrame({'ds': harvest_dates})
        
        future_features = create_features(future_df)[FEATURES]

        model_min = load_xgb_model(crop_name, 'min')
        model_max = load_xgb_model(crop_name, 'max')

        if not model_min or not model_max:
             return jsonify({"message": f"XGBoost models for '{crop_name}' not found!"}), 404

        min_preds = model_min.predict(future_features)
        max_preds = model_max.predict(future_features)

        total_min_income = 0
        total_max_income = 0

        for i, plan in enumerate(harvest_plan):
            p1 = float(min_preds[i])
            p2 = float(max_preds[i])
            
            day_min_price = min(p1, p2)
            day_max_price = max(p1, p2)
            
            total_min_income += (plan['yield_kg'] * day_min_price)
            total_max_income += (plan['yield_kg'] * day_max_price)

        return jsonify({
            "expectedMinIncome": round(total_min_income, 2),
            "expectedMaxIncome": round(total_max_income, 2),
            "totalHarvests": len(harvest_plan)
        })

    except Exception as e:
        print("Income Calculation Backend Error:", str(e))
        return jsonify({"message": "Internal server error occurred."}), 500

if __name__ == '__main__':
    print("🚀 Smart Polytunnel XGBoost API is running on http://127.0.0.1:5001")
    app.run(debug=True, port=5001)