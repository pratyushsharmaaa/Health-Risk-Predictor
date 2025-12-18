import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function DiabetesResult() {
  const router = useRouter()
  const { prediction, probability, advice } = router.query

  const [pred, setPred] = useState(null)
  const [prob, setProb] = useState(null)

  useEffect(() => {
    if (prediction !== undefined && probability !== undefined) {
      setPred(Number(prediction)) // used only for meds selection
      setProb(Number(probability))
    }
  }, [prediction, probability])

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Liver Risk Report</h1>

      {pred === null || prob === null ? (
        <p>Loading results…</p>
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-lg">
              <strong>Prediction:</strong>{' '}
              {prob >= 0.5
                ? `At Risk of Diabetes (${(prob * 100).toFixed(1)}%)`
                : `Low Risk of Diabetes (${(prob * 100).toFixed(1)}%)`}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className={`h-6 ${prob >= 0.5 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${(prob * 100).toFixed(1)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
                <h2 className="text-xl font-semibold">Advice</h2>
                <p>
                    {prob >= 0.5
                        ? 'Based on these lab results, there may be signs of liver dysfunction. Please consult a healthcare professional for further evaluation.'
                        : 'Your liver function appears to be within a healthy range. Continue routine monitoring and maintain a healthy lifestyle.'}
                </p>
           </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Suggested {prob >= 0.5 ? 'Medications' : 'Lifestyle Recommendations'}
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {(prob >= 0.5
                ? ['Metformin', 'Glipizide', 'Insulin Therapy']
                : ['Maintain healthy diet', 'Regular exercise', 'Routine check‑ups']
              ).map((m, i) => (
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
