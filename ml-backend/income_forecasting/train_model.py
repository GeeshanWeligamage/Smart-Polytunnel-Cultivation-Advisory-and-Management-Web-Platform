import pandas as pd
import xgboost as xgb
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit
import os

# Configuration
BASE_DIR = os.path.dirname(__file__)
TRAIN_FILE = os.path.join(BASE_DIR, 'data', 'Train_Dataset.csv')
DATE_COL = 'Date Column'
MIN_PRICE_COL = 'Min Price'
MAX_PRICE_COL = 'Max Price'
CROP_COL = 'Crop Name'

if not os.path.exists(TRAIN_FILE):
    print(f"Error: {TRAIN_FILE} not found. Please place the training dataset in the directory.")
    exit()

print(f"Loading data from {TRAIN_FILE}...")
df_train = pd.read_csv(TRAIN_FILE)

# Data Preprocessing
df_train['ds'] = pd.to_datetime(df_train[DATE_COL], errors='coerce')
df_train[MIN_PRICE_COL] = pd.to_numeric(df_train[MIN_PRICE_COL], errors='coerce')
df_train[MAX_PRICE_COL] = pd.to_numeric(df_train[MAX_PRICE_COL], errors='coerce')
df_train = df_train.dropna(subset=['ds', MIN_PRICE_COL, MAX_PRICE_COL, CROP_COL])

# Sort by date strictly for Time-Series accuracy
df_train = df_train.sort_values('ds')

unique_crops = df_train[CROP_COL].unique()

def create_features(df):
    df = df.copy()
    df['year'] = df['ds'].dt.year
    df['month'] = df['ds'].dt.month
    df['day'] = df['ds'].dt.day
    df['dayofweek'] = df['ds'].dt.dayofweek
    df['dayofyear'] = df['ds'].dt.dayofyear
    return df

FEATURES = ['year', 'month', 'day', 'dayofweek', 'dayofyear']

def remove_outliers(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    return df[(df[column] >= lower_bound) & (df[column] <= upper_bound)].copy()

def tune_and_train_xgb(train_df, target_col, save_path):
    train_df = create_features(train_df)
    X_train = train_df[FEATURES]
    y_train = train_df[target_col]

    xgb_model = xgb.XGBRegressor(random_state=42)

    # Simplified Grid to prevent Overfitting
    param_grid = {
        'n_estimators': [50, 100, 150], # Reduced trees
        'learning_rate': [0.05, 0.1],   
        'max_depth': [3, 4, 5],         # Prevent deep memorization
    }

    print(f"      Running Time-Series GridSearchCV...")
    
    # PRO FIX: Use TimeSeriesSplit instead of standard CV
    tscv = TimeSeriesSplit(n_splits=3)

    grid_search = GridSearchCV(
        estimator=xgb_model,
        param_grid=param_grid,
        scoring='neg_mean_absolute_error', 
        cv=tscv, # Applied Time-Series CV
        verbose=0,
        n_jobs=-1 
    )

    grid_search.fit(X_train, y_train)

    print(f"      Best Parameters: {grid_search.best_params_}")

    best_model = grid_search.best_estimator_
    best_model.save_model(save_path)

for crop in unique_crops:
    print("-" * 50)
    print(f"🚀 Time-Series Tuning XGBoost Models for {crop.upper()}...")
    
    df_crop = df_train[df_train[CROP_COL] == crop].copy()
    
    if len(df_crop) < 30:
        continue

    safe_crop_name = str(crop).strip().replace(" ", "_").lower()
    min_model_path = os.path.join(BASE_DIR, 'models', f"{safe_crop_name}_xgb_min.json")
    max_model_path = os.path.join(BASE_DIR, 'models', f"{safe_crop_name}_xgb_max.json")

    if crop.lower() == 'cucumber':
        print("   -> Strategy: STABLE (No Outliers Removed)")
        tune_and_train_xgb(df_crop, MIN_PRICE_COL, min_model_path)
        tune_and_train_xgb(df_crop, MAX_PRICE_COL, max_model_path)
    else:
        print("   -> Strategy: VOLATILE (Outliers Removed)")
        df_min = remove_outliers(df_crop[['ds', MIN_PRICE_COL]], MIN_PRICE_COL)
        df_max = remove_outliers(df_crop[['ds', MAX_PRICE_COL]], MAX_PRICE_COL)
        
        tune_and_train_xgb(df_min, MIN_PRICE_COL, min_model_path)
        tune_and_train_xgb(df_max, MAX_PRICE_COL, max_model_path)

print("-" * 50)
print("✅ Time-Series Hybrid Models successfully trained!")