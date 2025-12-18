// pages/info/cbc.js

import Link from 'next/link'

const sections = [
  {
    title: 'Key Biomarkers',
    content: `• WBC: 4,000–10,000 cells/µL
• RBC: 4.0–5.4M/µL (women), 4.5–6.1M/µL (men)
• Hemoglobin: 11.5–15.5 g/dL (women), 13–17 g/dL (men)
• Hematocrit: 36–48% (women), 40–55% (men)
• Platelets: 150,000–400,000/µL`,
    links: [
      { text: 'Cleveland Clinic CBC Ranges', href: 'https://my.clevelandclinic.org' }
    ]
  },
  {
    title: 'Common Abnormalities',
    content: `• ↑ WBC (Leukocytosis): Infection, inflammation, allergies, leukemia
• ↓ WBC (Leukopenia): Bone marrow issues, autoimmune, infections
• ↓ RBC/Hgb (Anemia): Iron/B12 deficiency, blood loss, chronic disease
• ↑ RBC (Polycythemia): Dehydration, polycythemia vera, lung disease
• ↓ Platelets (Thrombocytopenia): Bleeding risk, immune destruction, meds
• ↑ Platelets (Thrombocytosis): Reactive (infection), myeloproliferative disorders`,
    links: [
      { text: 'Cleveland Clinic Details', href: 'https://my.clevelandclinic.org' }
    ]
  },
  {
    title: 'Short Explanation',
    content: `A Complete Blood Count measures the cellular components of blood.
High WBC suggests infection/inflammation, low RBC/Hgb indicates anemia, and platelet levels relate to clotting health.`,
    links: []
  },
  {
    title: 'Health Tips',
    content: `• Eat iron-rich foods (red meat, beans, spinach) & B-vitamins for RBC health
• Treat infections promptly to normalize WBC
• Stay hydrated (prevents false RBC elevations)
• Consult your doctor about meds that affect blood counts
• Monitor platelet levels if prone to bleeding or clotting issues`,
    links: []
  },
  {
    title: 'Sources & References',
    content: `Authoritative medical guidelines used for ranges & interpretations.`,
    links: [
      { text: 'Mayo Clinic CBC', href: 'https://mayoclinic.org' },
      { text: 'MedlinePlus CBC', href: 'https://medlineplus.gov' },
      { text: 'ODS Nutrition', href: 'https://ods.od.nih.gov' }
    ]
  },
]

export default function CBCInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Complete Blood Count (CBC) Overview
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
