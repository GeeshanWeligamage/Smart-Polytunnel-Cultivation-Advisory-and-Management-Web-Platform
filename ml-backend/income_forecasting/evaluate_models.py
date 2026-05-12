import pandas as pd
import xgboost as xgb
from sklearn.metrics import mean_absolute_error
import numpy as np
import os

# Define file names and column mappings
BASE_DIR = os.path.dirname(__file__)
TEST_FILE = os.path.join(BASE_DIR, 'data', 'Test_Dataset.csv')
DATE_COL = 'Date Column'
CROP_COL = 'Crop Name'
MIN_PRICE_COL = 'Min Price'
MAX_PRICE_COL = 'Max Price'

if not os.path.exists(TEST_FILE):
    print(f"Error: {TEST_FILE} not found. Please ensure the test dataset is in the same directory.")
    exit()

print(f"Loading testing data from {TEST_FILE}...")
df_test = pd.read_csv(TEST_FILE)

# Data preprocessing
df_test['ds'] = pd.to_datetime(df_test[DATE_COL], errors='coerce')
df_test[MIN_PRICE_COL] = pd.to_numeric(df_test[MIN_PRICE_COL], errors='coerce')
df_test[MAX_PRICE_COL] = pd.to_numeric(df_test[MAX_PRICE_COL], errors='coerce')

# Drop rows with missing crucial data
df_test = df_test.dropna(subset=['ds', MIN_PRICE_COL, MAX_PRICE_COL, CROP_COL])

unique_crops = df_test[CROP_COL].unique()

# Feature engineering MUST be exactly the same as the training and API phases
def create_features(df):
    df = df.copy()
    df['year'] = df['ds'].dt.year
    df['month'] = df['ds'].dt.month
    df['day'] = df['ds'].dt.day
    df['dayofweek'] = df['ds'].dt.dayofweek
    df['dayofyear'] = df['ds'].dt.dayofyear
    return df

FEATURES = ['year', 'month', 'day', 'dayofweek', 'dayofyear']

def evaluate_xgb_model(test_df, target_col, model_path, model_name):
    if not os.path.exists(model_path):
        print(f"  -> Skipping {model_name}: Model '{model_path}' not found.")
        return

    # Load the trained XGBoost model
    model = xgb.XGBRegressor()
    model.load_model(model_path)

    # Prepare features and target values
    test_df = create_features(test_df)
    X_test = test_df[FEATURES]
    actual_prices = test_df[target_col].values

    # Predict using the loaded model
    predicted_prices = model.predict(X_test)

    # Calculate Evaluation Metrics
    mae = mean_absolute_error(actual_prices, predicted_prices)
    mean_actual = np.mean(actual_prices)
    
    # Calculate WAPE (Weighted Absolute Percentage Error)
    wape = mae / mean_actual if mean_actual != 0 else 1
    accuracy_percentage = (1 - wape) * 100

    # Ensure accuracy doesn't display as negative
    if accuracy_percentage < 0:
        accuracy_percentage = 0.00

    print(f"  -> {model_name} MAE: Rs. {mae:.2f}")
    print(f"  -> {model_name} Average Real Price: Rs. {mean_actual:.2f}")
    print(f"  -> {model_name} XGBoost Accuracy (WAPE): {accuracy_percentage:.2f}%\n")

# Run evaluation for each crop found in the test dataset
for crop in unique_crops:
    print("=" * 50)
    print(f"📊 EVALUATING XGBOOST: {crop.upper()}")
    print("=" * 50)
    
    df_crop = df_test[df_test[CROP_COL] == crop].copy()
    
    if len(df_crop) == 0:
        continue

    # Format crop name to match saved model filenames
    safe_crop_name = str(crop).strip().replace(" ", "_").lower()
    min_model_path = os.path.join(BASE_DIR, 'models', f"{safe_crop_name}_xgb_min.json")
    max_model_path = os.path.join(BASE_DIR, 'models', f"{safe_crop_name}_xgb_max.json")

    print("Evaluating Minimum Price Model...")
    evaluate_xgb_model(df_crop, MIN_PRICE_COL, min_model_path, "MIN PRICE")
    
    print("Evaluating Maximum Price Model...")
    evaluate_xgb_model(df_crop, MAX_PRICE_COL, max_model_path, "MAX PRICE")

print("Evaluation Complete!")