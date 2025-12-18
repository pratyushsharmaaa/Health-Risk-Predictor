// pages/api/diabetes/predict.js

import { extract_diabetes_report } from '../../../backend/extraction_diabetes'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 1. Receive uploaded PDF (e.g. via form-data)
  const { file } = req.body  // or use formidable/multer for multipart

  // 2. Extract values and get prediction/advice
  const result = extract_diabetes_report(file.filepath)  // adjust to your extract fn

  // 3. Return full JSON including lab_values
  return res.status(200).json({
    lab_values: result.lab_values,
    probability: result.probability,
    advice: result.advice
  })
}
