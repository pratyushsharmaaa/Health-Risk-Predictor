// pages/upload.js

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Upload() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [type, setType] = useState('liver')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showManualForm, setShowManualForm] = useState(false)
  const [manualInputs, setManualInputs] = useState({})
  const [infoField, setInfoField] = useState(null)
  const [showBadValuesPopup, setShowBadValuesPopup] = useState(false)

  // === RANGES & INFO_TEXT ===
  const RANGES = {
    Glucose:                    { min: 70,   max: 99,    unit: 'mg/dL' },
    BloodPressure:              { min: 60,   max: 90,    unit: 'mmHg' },
    SkinThickness:              null,
    Insulin:                    null,
    BMI:                        { min: 18.5, max: 24.9,  unit: '' },
    Age:                        { min: 0,    max: 120,   unit: 'yrs' },
    Total_Bilirubin:            { min: 0.2,  max: 1.2,   unit: 'mg/dL' },
    Direct_Bilirubin:           { min: 0.0,  max: 0.3,   unit: 'mg/dL' },
    Alkaline_Phosphotase:       { min: 44,   max: 147,   unit: 'U/L' },
    SERUM_PROTEIN:              { min: 6.4,  max: 8.3,   unit: 'g/dL' },
    Albumin:                    { min: 3.5,  max: 5.2,   unit: 'g/dL' },
    Albumin_and_Globulin_Ratio: { min: 1.1,  max: 2.1,   unit: '' },
  }

  const INFO_TEXT = {
    Glucose:            'Enter your fasting blood glucose in mg/dL.',
    BloodPressure:      'Enter your blood pressure (systolic) in mmHg.',
    SkinThickness:      'Triceps skinfold thickness (mm).',
    Insulin:            '2-hour serum insulin (μU/mL).',
    BMI:                'Body Mass Index in kg/m².',
    Age:                'Your age in years.',
    Total_Bilirubin:    'Total bilirubin (direct + indirect) in mg/dL.',
    Direct_Bilirubin:   'Direct (conjugated) bilirubin in mg/dL.',
    Alkaline_Phosphotase: 'Alkaline phosphatase in U/L.',
    SERUM_PROTEIN:      'Total serum protein in g/dL.',
    Albumin:            'Serum albumin in g/dL.',
    Albumin_and_Globulin_Ratio: 'Albumin/Globulin ratio (unitless).'
  }

  // determine which manual fields to render
  const manualFields = type === 'diabetes'
    ? ['Glucose','BloodPressure','SkinThickness','Insulin','BMI','Age']
    : ['Total_Bilirubin','Direct_Bilirubin','SERUM_PROTEIN','Alkaline_Phosphotase','Albumin','Albumin_and_Globulin_Ratio']

  // check for physiologically impossible entries
  const hasImpossible = () => {
    for (let field of manualFields) {
      const v = manualInputs[field]
      if (v == null) continue
      const range = RANGES[field]
      if (v < 0 || (range && v > range.max * 10)) return true
    }
    return false
  }

  // — Upload & Analyze PDF —
  const onUploadSubmit = async e => {
    e.preventDefault()
    if (!file) return setError('Please select a file.')
    setLoading(true)
    setError('')

    try {
      const data = new FormData()
      data.append('report', file)
      data.append('report_type', type)
      const res = await axios.post(
        'http://localhost:5000/api/upload',
        data,
        { withCredentials: true }
      )
      const result = res.data
      const page = type === 'diabetes' ? '/diabetes-result' : '/liver-result'
      router.push({
        pathname: page,
        query: {
          prediction: result.prediction,
          probability: result.probability,
          advice: result.advice
        }
      })
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  // — Manual Predict —
  const onManualSubmit = async e => {
    e.preventDefault()
    setError('')

    // block if impossible values found
    if (hasImpossible()) {
      setShowBadValuesPopup(true)
      return
    }

    try {
      const endpoint = type === 'diabetes' ? 'manual-diabetes' : 'manual-liver'
      const res = await axios.post(
        `http://localhost:5000/api/${endpoint}`,
        manualInputs,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      )
      const result = res.data
      const page = type === 'diabetes' ? '/diabetes-result' : '/liver-result'
      router.push({
        pathname: page,
        query: {
          prediction: result.prediction,
          probability: result.probability,
          advice: result.advice
        }
      })
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  const handleManualChange = (field, value) => {
    setManualInputs(prev => ({ ...prev, [field]: parseFloat(value) }))
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/images/upload-bg.jpg')" }}
    >
      <div className="max-w-xl w-full bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Upload & Analyze Report
        </h2>

        {/* — PDF Upload Form — */}
        <form onSubmit={onUploadSubmit}>
          <label className="block mb-2">
            Report Type
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="liver">Liver</option>
              <option value="diabetes">Diabetes</option>
            </select>
          </label>

          <label className="block mb-4">
            Select PDF
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setFile(e.target.files[0])}
              className="mt-1"
              required
            />
          </label>

          {error && <p className="mb-2 text-red-600">{error}</p>}

          <div className="flex gap-4 mb-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1"
            >
              {loading ? 'Uploading...' : 'Upload & Analyze'}
            </button>
            <button
              type="button"
              onClick={() => setShowManualForm(!showManualForm)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Manual Check
            </button>
          </div>
        </form>

        {/* — Manual Entry Form — */}
        {showManualForm && (
          <form
            onSubmit={onManualSubmit}
            className="space-y-6 mt-4 bg-white bg-opacity-60 backdrop-blur-sm p-4 rounded"
          >
            {manualFields.map(field => {
              const range = RANGES[field]
              const val   = manualInputs[field]
              let rangeMsg = ''
              let rangeClass = 'text-gray-600 text-sm'

              if (range) {
                rangeMsg = `${range.min} – ${range.max} ${range.unit}`
                if (val != null && (val < range.min || val > range.max)) {
                  rangeClass = 'text-red-600 text-sm'
                }
              }

              const physiologicImpossible = val != null &&
                (val < 0 || (range && val > range.max * 10))

              return (
                <div key={field} className="relative">
                  <label className="block mb-1 font-medium flex items-center">
                    {field.replace(/_/g,' ')}
                    <button
                      type="button"
                      onClick={() => setInfoField(infoField === field ? null : field)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      aria-label={`Info about ${field}`}
                    >
                      ❕️
                    </button>
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    className="w-full border px-3 py-2 rounded"
                    required
                    onChange={e => handleManualChange(field, e.target.value)}
                  />

                  {/* Range display */}
                  {range && (
                    <p className={`mt-1 ${rangeClass}`}>
                      Normal: {rangeMsg}
                    </p>
                  )}

                  {/* Physiologic check */}
                  {physiologicImpossible && (
                    <p className="mt-1 text-red-800 text-sm">
                      Please enter a genuine value.
                    </p>
                  )}

                  {/* Info popup */}
                  {infoField === field && (
                    <div
                      className="absolute z-20 top-full mt-1 left-0 bg-white border rounded shadow p-3 w-64 text-sm text-gray-800"
                      onMouseLeave={() => setInfoField(null)}
                    >
                      {INFO_TEXT[field]}
                    </div>
                  )}
                </div>
              )
            })}

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
              Predict Manually
            </button>
          </form>
        )}

      </div>

      {/* — Modal for Bad Values — */}
      {showBadValuesPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowBadValuesPopup(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Invalid Values</h3>
            <p>Please enter correct, physiologically possible values before predicting.</p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={() => setShowBadValuesPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
