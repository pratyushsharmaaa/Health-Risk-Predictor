// pages/info/vitamin-d.js

import Link from 'next/link'

const sections = [
  {
    title: 'Key Biomarkers',
    content: `• Vitamin D (25(OH)D): ≥20 ng/mL adequate; 12–20 insufficient; <12 deficient
• Serum Calcium: 8.5–10.2 mg/dL
• Bone Density (DEXA T-score): ≥–1.0 normal; –1.0 to –2.5 osteopenia; ≤–2.5 osteoporosis`,
    links: [
      { text: 'NIH Vitamin D Info', href: 'https://ods.od.nih.gov' },
      { text: 'MedlinePlus Bone Density', href: 'https://medlineplus.gov' }
    ]
  },
  {
    title: 'Common Abnormalities',
    content: `• Low Vitamin D → Rickets/osteomalacia; from low sun or diet
• High Vitamin D → Hypercalcemia risk (>50 ng/mL)
• Low Bone Density → Increased fracture risk; aging/hormonal factors
• High Bone Density → Rare; high bone mass`,
    links: [
      { text: 'NIH Vitamin D Deficiency', href: 'https://ods.od.nih.gov' }
    ]
  },
  {
    title: 'Short Explanation',
    content: `Vitamin D is crucial for calcium absorption and bone mineralization.
Abnormal levels or low bone density signify weakened bone structure and fracture risk.`,
    links: []
  },
  {
    title: 'Health Tips',
    content: `• Safe sun exposure to boost Vitamin D
• Eat Vitamin D–rich foods or take supplements
• Ensure adequate calcium (dairy, leafy greens)
• Weight-bearing exercise to maintain bone density
• Avoid smoking & limit alcohol to protect bones`,
    links: []
  },
  {
    title: 'Notable Research',
    content: `• Vitamin D & Fracture Prevention (Lancet, 2020)
• Calcium Supplementation Risks/Benefits (JAMA, 2019)`,
    links: [
      { text: 'Lancet Fracture Study', href: 'https://www.thelancet.com' },
      { text: 'JAMA Calcium Review', href: 'https://jamanetwork.com' }
    ]
  },
]

export default function VitaminDInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Vitamin D & Bone Health
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
