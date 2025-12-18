import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/models → backend
DATA_PATH = os.path.join(BASE_DIR, 'data', 'diabetes.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'diabetes_model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.pkl')


def train_and_save_model():
    # 1. Load dataset
    df = pd.read_csv(DATA_PATH)

    # 2. Optionally generate synthetic HbA1c or fill missing values here...
    #    (Assuming original CSV already has all six columns: Glucose, BloodPressure,
    #     SkinThickness, Insulin, BMI, Age, plus Outcome.)

    # 3. Features & label
    features = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "Age"]
    X = df[features]
    y = df["Outcome"]

    # 4. Split & scale
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    scaler = StandardScaler().fit(X_train)
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 5. Train model
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train_scaled, y_train)

    # 6. Evaluate
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy with 6 features: {acc * 100:.2f}%")

    # 7. Persist artifacts
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    print("✅ Model and scaler saved successfully!")


def predict_diabetes(feature_vector):
    """
    Given [Glucose, BloodPressure, SkinThickness, Insulin, BMI, Age],
    scale and predict.
    Returns: (prediction: 0 or 1, probability: float)
    """
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        raise FileNotFoundError("Model or scaler not found. Run training first.")

    # 1. Load artifacts
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    # 2. Prepare input
    arr = np.array(feature_vector, dtype=float).reshape(1, -1)
    arr_scaled = scaler.transform(arr)

    # 3. Predict
    pred = int(model.predict(arr_scaled)[0])
    prob = float(model.predict_proba(arr_scaled)[0][pred])
    return pred, prob


if __name__ == "__main__":
    train_and_save_model()
