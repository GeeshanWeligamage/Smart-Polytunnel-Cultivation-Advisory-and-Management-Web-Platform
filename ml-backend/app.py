from flask import Flask, request, jsonify
from prophet.serialize import model_from_json
import pandas as pd

app = Flask(__name__)

# Models දෙකම වෙන වෙනම Load කරගැනීම
print("Loading ML Models...")
with open('prophet_model_min.json', 'r') as fin:
    model_min = model_from_json(fin.read())

with open('prophet_model_max.json', 'r') as fin:
    model_max = model_from_json(fin.read())
print("Models Loaded Successfully!")

@app.route('/predict', methods=['POST'])
def predict_prices():
    try:
        data = request.json
        future_dates = data.get('dates', [])

        future = pd.DataFrame({'ds': pd.to_datetime(future_dates)})

        # Models දෙකෙන්ම අනාගතය පුරෝකථනය කිරීම
        forecast_min = model_min.predict(future)
        forecast_max = model_max.predict(future)

        result = []
        for i in range(len(future_dates)):
            result.append({
                "date": forecast_min.iloc[i]['ds'].strftime('%Y-%m-%d'),
                "predicted_min_price": round(forecast_min.iloc[i]['yhat'], 2), # පුරෝකථනය කළ අවම මිල
                "predicted_max_price": round(forecast_max.iloc[i]['yhat'], 2)  # පුරෝකථනය කළ උපරිම මිල
            })

        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Python ML Server is running on http://localhost:5001")
    app.run(port=5001)