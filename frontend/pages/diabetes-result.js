import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function DiabetesResult() {
  const router = useRouter()
  const { prediction, probability } = router.query

  const [pred, setPred] = useState(null)
  const [prob, setProb] = useState(null)

  useEffect(() => {
    if (prediction !== undefined && probability !== undefined) {
      setPred(Number(prediction))
      setProb(Number(probability))
    }
  }, [prediction, probability])

  // Advice based on probability, not prediction
  const adviceMessage = prob >= 0.5
    ? 'Your results indicate a potential risk of diabetes. It is recommended to consult a healthcare provider for further tests and preventive guidance.'
    : 'Your results suggest a low risk of diabetes. Keep following a healthy diet, regular exercise, and routine checkups to stay on track.'

  const meds = prob >= 0.5
    ? ['Metformin', 'Glipizide', 'Insulin Therapy']
    : ['Maintain healthy diet', 'Regular exercise', 'Routine check‑ups']

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Diabetes Risk Report</h1>

      {pred === null || prob === null ? (
        <p>Loading results…</p>
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-lg">
              <strong>Prediction:</strong>{' '}
              {prob >= 0.5 ? 'At Risk of Diabetes' : 'Low Risk of Diabetes'}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className={`h-6 ${prob >= 0.5 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${(prob * 100).toFixed(1)}%` }}
              />
            </div>
            <p className="text-center mt-1">
              <strong>Probability:</strong> {(prob * 100).toFixed(1)}%
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Advice</h2>
            <p>{adviceMessage}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Suggested {prob >= 0.5 ? 'Medications' : 'Lifestyle Recommendations'}</h2>
            <ul className="list-disc list-inside space-y-1">
              {meds.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="text-center">
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
