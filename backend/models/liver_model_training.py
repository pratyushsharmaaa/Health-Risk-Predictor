# liver_model_training.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# ---------------------
# Load and Preprocess Data
# ---------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/models → backend
DATA_PATH = os.path.join(BASE_DIR, 'data', 'indian_liver_patient.csv')

df = pd.read_csv(DATA_PATH)
df = df[['Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase',
         'Total_Protiens', 'Albumin', 'Albumin_and_Globulin_Ratio', 'Dataset']].dropna()

# Compute Globulin if needed
df['Globulin'] = df['Total_Protiens'] - df['Albumin']

# Features and labels
features = ['Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase',
            'Total_Protiens', 'Albumin', 'Albumin_and_Globulin_Ratio']
X = df[features]
y = df['Dataset']

# ---------------------
# Train-Test Split
# ---------------------
X_train, X_test, y_train, y_test = train_test_split(X, y,
                                                    test_size=0.2,
                                                    random_state=42,
                                                    stratify=y)

# ---------------------
# Train the Model
# ---------------------
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ---------------------
# Evaluate the Model
# ---------------------
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Liver Model Accuracy: {acc:.2f}")
print("Classification Report:")
print(classification_report(y_test, y_pred))

# ---------------------
# Save the Model
# ---------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'liver_model.pkl')
with open(MODEL_PATH, 'wb') as f:
    pickle.dump(model, f)

print(f"Trained liver model saved as '{MODEL_PATH}'.")
