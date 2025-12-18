# backend/extraction_liver_ocr.py

import re
import os
from pdf2image import convert_from_path
from PIL import Image
import pytesseract
from models.liver_model import predict_liver_disease

FEATURE_KEYS = [
    'Total_Bilirubin','Direct_Bilirubin','Alkaline_Phosphotase',
    'Total_Protiens','Albumin','Albumin_and_Globulin_Ratio'
]

LABEL_PATTERNS = {
    'Total_Bilirubin':             r'serum bilirubin \(total\)',
    'Direct_Bilirubin':            r'serum bilirubin \(direct\)',
    'Alkaline_Phosphotase':        r'alkaline phosphatase|alp',
    'Total_Protiens':              r'total protein|serum protein',
    'Albumin':                     r'serum albumin',
    'Albumin_and_Globulin_Ratio':  r'a\s*/?\s*g\s*ratio'
}

def image_to_text(image: Image.Image) -> str:
    # You can tweak psm / OCR Engine Mode here if needed
    return pytesseract.image_to_string(image, lang='eng')

def extract_liver_report_ocr(filepath: str):
    # 1. Convert PDF → images
    pages = convert_from_path(filepath, dpi=300)
    full_text = ""
    for img in pages:
        # 2. OCR each page
        text = image_to_text(img)
        full_text += text + "\n"

    txt = full_text.lower().replace('\n', ' ')
    # collapse whitespace
    txt = re.sub(r'\s+', ' ', txt)

    # 3. Regex-extract
    lab = {}
    for key in FEATURE_KEYS:
        pat = LABEL_PATTERNS[key]
        rx = re.compile(rf'{pat}\D*([\d]+(?:\.\d+)?)', re.IGNORECASE)
        m = rx.search(txt)
        lab[key] = float(m.group(1)) if m else None

    # 4. Compute A/G if missing
    if lab['Albumin_and_Globulin_Ratio'] is None:
        alb, tp = lab['Albumin'], lab['Total_Protiens']
        if alb and tp and tp != alb:
            glob = tp - alb
            lab['Albumin_and_Globulin_Ratio'] = round(alb / glob, 2)

    print("OCR-extracted values:", lab)

    missing = [k for k,v in lab.items() if v is None]
    if missing:
        raise ValueError(f"OCR extraction failed for: {', '.join(missing)}")

    # 5. Predict
    fv = [lab[k] for k in FEATURE_KEYS]
    pred, prob = predict_liver_disease(fv)

    return {
        'lab_values': lab,
        'prediction': int(pred),
        'probability': float(prob),
        'advice': (
          f"Based on OCR'd labs, class {pred} indicates "
          f"{'presence' if pred==1 else 'absence'} of liver disease."
        )
    }
