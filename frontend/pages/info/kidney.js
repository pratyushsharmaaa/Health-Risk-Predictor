// pages/info/kidney.js

import Link from 'next/link'

const sections = [
  {
    title: 'Key Kidney Biomarkers',
    content: `• Serum Creatinine: 0.6–1.3 mg/dL
• BUN: 8–20 mg/dL
• eGFR: >90 mL/min/1.73m² normal; <60 indicates CKD
• Urine ACR: <30 mg/g (men <17, women <25)`,
    links: [
      { text: 'Mayo Clinic Kidney Tests', href: 'https://mayoclinic.org' },
      { text: 'MedlinePlus Kidney Biomarkers', href: 'https://medlineplus.gov' }
    ]
  },
  {
    title: 'Common Abnormalities',
    content: `• ↑ BUN/Creatinine → impaired filtration (AKI/CKD, dehydration)
• ↓ eGFR (<60) → reduced kidney function
• ↑ UACR → kidney damage (diabetes, hypertension)
• ↓ BUN/Creatinine → overhydration, malnutrition, severe liver disease`,
    links: [
      { text: 'MedlinePlus Kidney Function', href: 'https://medlineplus.gov' },
      { text: 'Mayo Clinic eGFR Info', href: 'https://mayoclinic.org' }
    ]
  },
  {
    title: 'How It Works',
    content: `Kidneys filter waste products from the blood (creatinine, BUN).
Elevated levels signal inefficient waste removal and reduced filtration.`,
    links: []
  },
  {
    title: 'Lifestyle & Prevention',
    content: `• Stay well-hydrated to support filtration.
• Control blood pressure & blood sugar.
• Avoid excessive NSAIDs or nephrotoxins.
• Follow kidney-friendly diet: low salt, moderate protein, fresh produce.
• Regular checkups if at risk (diabetes, HTN, family history).`,
    links: []
  },
  {
    title: 'Notable Research',
    content: `• SGLT2 Inhibitors & Renal Protection (NEJM, 2020)
• Hepatorenal Syndrome Review (PMC, 2019)`,
    links: [
      { text: 'NEJM SGLT2 Study', href: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1901736' },
      { text: 'PMC Hepatorenal Review', href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6519316/' }
    ]
  },
]

export default function KidneyInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Kidney Function Tests & Insights
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

      {/* 3D perspective CSS */}
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
