// pages/info/lipid.js

import Link from 'next/link'

const sections = [
  {
    title: 'Key Biomarkers',
    content: `• Total Cholesterol: <200 mg/dL (desirable)
• LDL (“bad”): <100 mg/dL optimal (<70 if heart disease)
• HDL (“good”): ≥60 mg/dL protective; <40 (men)/<50 (women) low
• Triglycerides: <150 mg/dL normal; 150–199 borderline; ≥200 high`,
    links: [
      { text: 'Mayo Clinic Lipid Panel', href: 'https://mayoclinic.org' },
      { text: 'American Heart Association', href: 'https://heart.org' }
    ]
  },
  {
    title: 'Common Abnormalities',
    content: `• ↑ LDL/Total Cholesterol → Atherosclerosis risk
• ↓ HDL → Less protective removal of fats
• ↑ Triglycerides → Linked to obesity, diabetes, metabolic syndrome
• ↑ HDL → Generally good; helps protect arteries`,
    links: [
      { text: 'Heart.org Cholesterol Info', href: 'https://heart.org' },
      { text: 'Mayo Clinic HDL/LDL Ranges', href: 'https://mayoclinic.org' }
    ]
  },
  {
    title: 'Short Explanation',
    content: `A lipid profile assesses blood fats.
High LDL or triglycerides increase the risk of heart and artery disease, while high HDL is protective.`,
    links: []
  },
  {
    title: 'Health Tips',
    content: `• Eat heart-healthy fats (olive oil, nuts, avocados) & fiber (fruits, veggies, whole grains)
• Reduce saturated/trans fats (limit fried foods, fatty meats, full-fat dairy)
• Exercise regularly to raise HDL & lower LDL/triglycerides
• Maintain healthy weight & avoid smoking (smoking lowers HDL)
• Follow medical advice for cholesterol-lowering meds if needed`,
    links: []
  },
  {
    title: 'Notable Research',
    content: `• PCSK9 Inhibitors in LDL Management (NEJM, 2019)
• Role of Triglycerides in CVD Risk (JAMA Cardiol, 2021)`,
    links: [
      { text: 'NEJM PCSK9 Study', href: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1807093' },
      { text: 'JAMA Cardiol Triglycerides', href: 'https://jamanetwork.com/journals/jamacardiology/fullarticle/2771527' }
    ]
  },
]

export default function LipidInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Lipid Profile & Cardiovascular Risk
        </h1>

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
