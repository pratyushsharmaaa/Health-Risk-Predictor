// components/ProfileOverview.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Card, CardHeader, CardContent, CardTitle } from './ui/card'
import { Button } from './ui/button'

export default function ProfileOverview() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE}/me`, { withCredentials: true })
      .then(res => setProfile(res.data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading…</p>
  if (error)   return <p className="text-red-600">{error}</p>

  // calculate age
  let age = null
  if (profile.dob) {
    const birth = new Date(profile.dob)
    age = Math.floor((Date.now() - birth) / 31557600000)
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card className="shadow-lg rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl">My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {[
            ['First Name', profile.first_name],
            ['Last Name',  profile.last_name],
            ['Date of Birth', profile.dob],
            ['Age', age],
            ['Gender', profile.gender],
            ['Address', profile.address],
            ['Phone', profile.phone]
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between py-2 border-b last:border-none"
            >
              <span className="font-medium">{label}</span>
              <span>{value ?? 'N/A'}</span>
            </div>
          ))}

          {/* Buttons row */}
          <div className="flex justify-center space-x-4 mt-6">
            <Button
              variant="default"
              onClick={() => router.push('/profile/edit')}
              className="rounded-2xl"
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="rounded-2xl"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
