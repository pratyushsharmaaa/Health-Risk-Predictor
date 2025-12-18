// pages/dashboard.js

import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [role, setRole] = useState('')
  const [users, setUsers] = useState([])
  const router = useRouter()

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE}/users`, { withCredentials: true })
      .then(r => { setUsers(r.data); setRole('Admin') })
      .catch(() => setRole('User'))
  }, [])

  const topics = [
    { name: 'Liver Function',       image: '/images/liver.png',   path: '/info/liver'     },
    { name: 'Kidney Function',      image: '/images/kidney.png',  path: '/info/kidney'    },
    { name: 'Blood Glucose',        image: '/images/glucose.png', path: '/info/glucose'   },
    { name: 'Lipid Profile',        image: '/images/lipid.png',   path: '/info/lipid'     },
    { name: 'Vitamin D & Bone',     image: '/images/vitd.png',    path: '/info/vitamin-d' },
    { name: 'Complete Blood Count', image: '/images/cbc.png',     path: '/info/cbc'       },
  ]

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">

      {/* Header with two buttons */}
      <div className="flex justify-center items-center mb-8 space-x-4">
        <button
          onClick={() => router.push('/upload')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Check Report
        </button>

        <button
          onClick={() => router.push('/doctors')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Doctor’s List
        </button>
      </div>

      {/* Admin User List */}
      {role === 'Admin' && (
        <div className="mb-8 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <ul className="space-y-1">
            {users.map(u => (
              <li key={u.id} className="border-b py-2">
                {u.username}{' '}
                <span className="italic text-gray-600">({u.role})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Health Topic Buttons */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Health Topics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {topics.map(topic => (
            <div
              key={topic.name}
              onClick={() => router.push(topic.path)}
              className="cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col items-center"
            >
              <img
                src={topic.image}
                alt={topic.name}
                className="w-24 h-24 object-contain mb-4"
              />
              <span className="font-medium text-center">{topic.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
