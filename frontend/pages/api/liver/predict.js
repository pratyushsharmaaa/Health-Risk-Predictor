// pages/api/liver/predict.js

import { extract_liver_report } from '../../../backend/extraction_liver'

export const config = {
  api: {
    bodyParser: false, // if you’re using formidable/multer for file uploads
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // Assuming you parse the uploaded file into `filepath`
  const { file } = req.body
  const result = extract_liver_report(file.filepath)

  return res.status(200).json({
    lab_values: result.lab_values,
    probability: result.probability,
    advice: result.advice,
  })
}
