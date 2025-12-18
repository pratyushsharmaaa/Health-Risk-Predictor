# backend/extraction_diabetes.py

import re
import numpy as np
import pdfplumber

# 1. Import your model inference function
from models.diabetes_model import predict_diabetes

# Regex patterns for each lab field (case‑insensitive, flexible spacing/punctuation)
patterns = {
    'Glucose':        r'(?:glucose)\D*([\d]+(?:\.[\d]+)?)',
    'BloodPressure':  r'(?:blood\s*pressure|bp)\D*([\d]+(?:\.[\d]+)?)',
    'SkinThickness':  r'(?:skin\s*thickness)\D*([\d]+(?:\.[\d]+)?)',
    'Insulin':        r'(?:insulin)\D*([\d]+(?:\.[\d]+)?)',
    'BMI':            r'(?:bmi)\D*([\d]+(?:\.[\d]+)?)',
    'Age':            r'(?:age)\D*([\d]+(?:\.[\d]+)?)'
}

def extract_diabetes_report(filepath):
    """
    Reads the PDF at `filepath`, extracts six diabetes-related lab values,
    runs the model, and returns a dict:
      {
        lab_values: { ... },
        prediction: int,
        probability: float,
        advice: str
      }
    """
    # 1. Extract full text
    raw = ''
    with pdfplumber.open(filepath) as pdf:
        for page in pdf.pages:
            txt = page.extract_text()
            if txt:
                raw += txt + '\n'

    # 2. Normalize
    txt = raw.lower()
    txt = re.sub(r'[\(\)]', ' ', txt)
    txt = re.sub(r'[^\w\d\.\:\-\s]', ' ', txt)

    # 3. Apply patterns with safe float conversion
    lab_values = {}
    for key, pat in patterns.items():
        m = re.search(pat, txt, flags=re.IGNORECASE)
        if m:
            try:
                lab_values[key] = float(m.group(1))
            except ValueError:
                lab_values[key] = np.nan
        else:
            lab_values[key] = np.nan

    # 4. Validate none missing
    missing = [k for k, v in lab_values.items() if np.isnan(v)]
    if missing:
        raise RuntimeError(f"Missing or invalid values for: {', '.join(missing)}")

    # 5. Build feature vector
    feature_vector = [
        lab_values['Glucose'],
        lab_values['BloodPressure'],
        lab_values['SkinThickness'],
        lab_values['Insulin'],
        lab_values['BMI'],
        lab_values['Age']
    ]

    # 6. Model inference
    prediction, probability = predict_diabetes(feature_vector)

    # 7. Generate advice based on probability
    if probability >= 0.5:
        advice = (
            "Your results indicate a potential risk of diabetes. "
            "Please consult a healthcare provider for further tests and preventive guidance."
        )
    else:
        advice = (
            "Your results suggest a low risk of diabetes. "
            "Continue following a healthy diet, regular exercise, and routine check‑ups."
        )

    # 8. Return structured result
    return {
        'lab_values': lab_values,
        'prediction': int(prediction),
        'probability': float(probability),
        'advice': advice
    }
