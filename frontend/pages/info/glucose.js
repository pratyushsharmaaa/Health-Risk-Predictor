// pages/info/glucose.js

import Link from 'next/link'

const sections = [
  {
    title: 'Key Biomarkers',
    content: `• Fasting Glucose: 70–99 mg/dL
• Prediabetes: 100–125 mg/dL
• Diabetes: ≥126 mg/dL (on two tests)
• HbA1c: <5.7% normal; 5.7–6.4% prediabetes; ≥6.5% diabetes`,
    links: [
      { text: 'Cleveland Clinic Glucose Ranges', href: 'https://my.clevelandclinic.org' },
      { text: 'Mayo Clinic HbA1c Info', href: 'https://mayoclinic.org' }
    ]
  },
  {
    title: 'Common Abnormalities',
    content: `• ↑ Glucose/HbA1c → Prediabetes or diabetes; can indicate insulin resistance
• ↓ Glucose (<70 mg/dL) → Hypoglycemia; causes include excess insulin or certain meds`,
    links: [
      { text: 'MedlinePlus Diabetes', href: 'https://medlineplus.gov' }
    ]
  },
  {
    title: 'Short Explanation',
    content: `Glucose tests measure blood sugar—the body’s main energy source.
High fasting glucose or HbA1c indicates glucose regulation issues (prediabetes/diabetes).`,
    links: []
  },
  {
    title: 'Health Tips',
    content: `• Eat balanced meals: whole grains, lean proteins, fiber; limit added sugars
• Maintain healthy weight & exercise for insulin sensitivity
• Monitor portions and avoid skipping meals
• Follow medical guidance & meds if diabetic/prediabetic
• Stay hydrated and check levels as advised`,
    links: []
  },
  {
    title: 'Notable Research',
    content: `• Diabetes Prevention Program (NEJM, 2002)
• Impact of Diet on HbA1c (Lancet Diabetes, 2021)`,
    links: [
      { text: 'DPP Study', href: 'https://www.nejm.org' },
      { text: 'Lancet Diet & HbA1c', href: 'https://www.thelancet.com' }
    ]
  },
]

export default function GlucoseInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Blood Glucose & HbA1c Tests
        </h1>

        {/* 3D card grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((sec) => (
            <div key={sec.title} className="relative group perspective">
              <div className="bg-white rounded-xl shadow-xl transform transition-transform duration-500 group-hover:rotate-y-3 group-hover:scale-105 p-6 h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-4">{sec.title}</h2>
                <p className="whitespace-pre-line text-gray-700 flex-grow">
                  {sec.content}
                </p>
                {sec.links.length > 0 && (
                  <ul className="mt-4 space-y-1">
                    {sec.links.map((l, i) => (
                      <li key={i}>
                        <Link href={l.href} className="text-blue-600 hover:underline">
                          {l.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .rotate-y-3 {
          transform: perspective(1000px) rotateY(3deg);
        }
      `}</style>
    </div>
  )
}
