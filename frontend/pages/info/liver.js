// pages/info/liver.js

import Link from 'next/link'

const sections = [
  {
    title: 'Key Biomarkers',
    content: `• ALT: ~7–55 U/L
• AST: ~8–48 U/L
• ALP: ~40–129 U/L
• Total Bilirubin: ~0.1–1.2 mg/dL
• Albumin: ~3.5–5.0 g/dL
• Total Protein: ~6.3–7.9 g/dL`,
    links: [
      { text: 'Mayo Clinic ALT/AST Ranges', href: 'https://mayoclinic.org' }
    ]
  },
  {
    title: 'Common Abnormalities',
    content: `• High ALT/AST → Liver inflammation/damage (hepatitis, fatty liver)
• High ALP/GGT → Bile duct obstruction (gallstones)
• High Bilirubin → Jaundice risk
• Low Albumin → Chronic liver disease
• High Albumin → Dehydration`,
    links: [
      { text: 'MedlinePlus Albumin Info', href: 'https://medlineplus.gov' }
    ]
  },
  {
    title: 'Lifestyle & Prevention',
    content: `• Limit alcohol & avoid hepatotoxins
• Maintain healthy weight & exercise
• Balanced diet: fruits, veggies, lean protein
• Vaccinations: Hepatitis A/B`,
  },
  {
    title: 'Treatments & Therapies',
    content: `• Antiviral therapy for hepatitis
• Lifestyle interventions for NAFLD
• Bile acid modulators for cholestatic disease`,
    links: [
      { text: 'Fatty Liver Foundation', href: 'https://fattyliverfoundation.org' }
    ]
  },
  {
    title: 'Notable Research',
    content: `• Gut-Liver Axis in NAFLD (Cell Metab, 2024)
• FXR Agonists for Cholestasis (Hepatology, 2023)`,
  }
]

export default function LiverInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Liver Function Tests & Insights
        </h1>

        {/* 3D card grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(sec => (
            <div key={sec.title} className="relative group perspective">
              <div className="bg-white rounded-xl shadow-xl transform transition-transform duration-500 group-hover:rotate-y-3 group-hover:scale-105 p-6 h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-4">{sec.title}</h2>
                <p className="whitespace-pre-line text-gray-700 flex-grow">{sec.content}</p>
                {sec.links && (
                  <ul className="mt-4 space-y-1">
                    {sec.links.map((l,i) => (
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
          <Link href="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
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
