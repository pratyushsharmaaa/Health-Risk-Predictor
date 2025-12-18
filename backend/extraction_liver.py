
# backend/extraction_liver.py

import re
from PyPDF2 import PdfReader
from models.liver_model import predict_liver_disease

# Exact keys as per your Excel
FEATURE_KEYS = [
    'Total_Bilirubin',
    'Direct_Bilirubin',
    'Alkaline_Phosphotase',
    'Total_Protiens',
    'Albumin',
    'Albumin_and_Globulin_Ratio'
]

# Mapping feature → regex label fragments (exact table labels)
LABEL_PATTERNS = {
    'Total_Bilirubin':            r'serum bilirubin \(total\)',
    'Direct_Bilirubin':           r'serum bilirubin \(direct\)',
    'Alkaline_Phosphotase':       r'serum alkaline phosphatase',
    'Total_Protiens':             r'serum protein',
    'Albumin':                    r'serum albumin',
    'Albumin_and_Globulin_Ratio': r'a/?g ratio'
}

# Pattern to capture the numeric value right after label
def find_value(text, label_pattern):
    # match label then optional spaces then number
    pat = rf"{label_pattern}\s*[:]?\s*([\d]+(?:\.[\d]+)?)"
    m = re.search(pat, text, flags=re.IGNORECASE)
    return float(m.group(1)) if m else None


def extract_liver_report(filepath):
    # 1) Read full PDF text
    reader = PdfReader(filepath)
    txt = "".join((page.extract_text() or '') + '\n' for page in reader.pages)

    # normalize for regex
    txt_norm = txt.lower().replace('\n', ' ')

    # 2) Extract values
    lab_values = {}
    for key in FEATURE_KEYS:
        pattern = LABEL_PATTERNS[key]
        val = find_value(txt_norm, pattern)
        lab_values[key] = val

    # 3) Compute A/G if missing
    if lab_values['Albumin_and_Globulin_Ratio'] is None:
        alb = lab_values.get('Albumin')
        tp = lab_values.get('Total_Protiens')
        if alb is not None and tp is not None and tp != alb:
            glob = tp - alb
            if glob > 0:
                lab_values['Albumin_and_Globulin_Ratio'] = round(alb / glob, 2)

    # 4) Debug print to verify extraction
    print("Extracted liver values:", lab_values)

    # 5) Check for missing values
    missing = [k for k, v in lab_values.items() if v is None]
    if missing:
        raise ValueError(f"Missing values for: {', '.join(missing)}")

    # 5) Build feature vector (no Nones) & predict
    fv = [lab_values[k] if lab_values[k] is not None else 0.0 for k in FEATURE_KEYS]
    prediction, probability = predict_liver_disease(fv)

    # 7) Advice
    status = 'presence' if prediction == 1 else 'absence'
    advice = (
        f"Based on these lab results, a predicted class of {prediction} "
        f"indicates {status} of liver disease. "
        "Please consult a healthcare professional for follow-up."
    )

    return {
        'lab_values': lab_values,
        'prediction': int(prediction),
        'probability': float(probability),
        'advice': advice
    }

