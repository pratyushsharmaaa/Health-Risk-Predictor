import os
import pickle
import numpy as np

# Load the trained model once on import
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'liver_model.pkl')
with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)

# Print model loading status and accuracy (manually known)
print("✅ Liver disease model loaded successfully.")
print("📊 Model Training Accuracy: 78.5%")  # Replace with your actual training accuracy

def predict_liver_disease(feature_vector: list) -> tuple:
    """
    Predicts liver disease presence from a list of six feature values in this order:
      [Total_Bilirubin,
       Direct_Bilirubin,
       Alkaline_Phosphotase,
       Total_Protiens,
       Albumin,
       Albumin_and_Globulin_Ratio]

    Returns:
      (prediction: int, probability: float)
    """
    # Validate input length
    if not isinstance(feature_vector, (list, tuple)) or len(feature_vector) != 6:
        raise ValueError("Feature vector must be a list of six numeric values.")

    # Convert to 2D array for sklearn
    features = np.array([feature_vector], dtype=float)

    # Perform prediction
    prediction = model.predict(features)[0]
    # predict_proba returns [prob_class0, prob_class1]
    probability = model.predict_proba(features)[0][int(prediction)]

    return int(prediction), float(probability)
