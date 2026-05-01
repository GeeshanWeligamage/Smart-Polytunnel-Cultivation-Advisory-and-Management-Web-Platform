import pandas as pd
import numpy as np
from prophet import Prophet
from prophet.serialize import model_to_json
import os

print("1. Data load වෙමින් පවතී...")

if not os.path.exists('capsicum.csv'):
    print("❌ Error: 'capsicum.csv' ෆයිල් එක ml-backend ෆෝල්ඩරයේ නැහැ!")
    exit()

df = pd.read_csv('capsicum.csv')

try:
    # Date එක හදාගැනීම
    df['Date'] = pd.to_datetime(df['Date Column'])
    
    # Min Price එක සහ Max Price එක වෙන වෙනම වෙන් කරගැනීම
    df_min = df[['Date', 'Min Price']].rename(columns={'Date': 'ds', 'Min Price': 'y'})
    df_max = df[['Date', 'Max Price']].rename(columns={'Date': 'ds', 'Max Price': 'y'})
except KeyError as e:
    print(f"❌ Error: CSV ෆයිල් එකේ column නම් වැරදියි: {e}")
    exit()

print("2. Data Augmentation (දත්ත වැඩි කිරීම) ආරම්භ විය...")

# දත්ත වැඩි කරන Function එක (Min සහ Max දෙකටම පාවිච්චි කරන්න පුළුවන් වෙන්න හැදුවා)
def augment_data(data):
    df_last_year = data.copy()
    df_last_year['ds'] = df_last_year['ds'] - pd.DateOffset(years=1)
    df_last_year['y'] = df_last_year['y'] * np.random.uniform(0.90, 0.95, len(data))

    df_2years_ago = data.copy()
    df_2years_ago['ds'] = df_2years_ago['ds'] - pd.DateOffset(years=2)
    df_2years_ago['y'] = df_2years_ago['y'] * np.random.uniform(0.80, 0.85, len(data))

    return pd.concat([df_2years_ago, df_last_year, data])

# Min සහ Max දත්ත දෙකම අවුරුදු 3කට වැඩි කිරීම
final_df_min = augment_data(df_min)
final_df_max = augment_data(df_max)

print("3. ML Models Train වෙමින් පවතී (Min සහ Max සඳහා වෙන වෙනම)...")

# Min Price සඳහා Model එක
model_min = Prophet(yearly_seasonality=True, daily_seasonality=False)
model_min.fit(final_df_min)

# Max Price සඳහා Model එක
model_max = Prophet(yearly_seasonality=True, daily_seasonality=False)
model_max.fit(final_df_max)

print("4. Models Save කරමින් පවතී...")

# Min Model එක Save කිරීම
with open('prophet_model_min.json', 'w') as fout:
    fout.write(model_to_json(model_min))

# Max Model එක Save කිරීම
with open('prophet_model_max.json', 'w') as fout:
    fout.write(model_to_json(model_max))

print("✅ සුබ පැතුම්! Min සහ Max Models දෙකම සාර්ථකව Train කර Save කරන ලදී!")