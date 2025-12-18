// components/ProfileEditForm.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Card, CardHeader, CardContent, CardTitle } from './ui/card'
import { Button } from './ui/button'

export default function ProfileEditForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    address: '',
    phone: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE}/me`, { withCredentials: true })
      .then(res => {
        setForm({
          first_name: res.data.first_name || '',
          last_name:  res.data.last_name  || '',
          dob:        res.data.dob        || '',
          gender:     res.data.gender     || '',
          address:    res.data.address    || '',
          phone:      res.data.phone      || ''
        })
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE}/me`,
        {
          first_name: form.first_name,
          last_name:  form.last_name,
          dob:        form.dob,
          gender:     form.gender,
          address:    form.address,
          phone:      form.phone
        },
        { withCredentials: true }
      )
      router.push('/profile')
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading…</p>

  return (
    <div className="max-w-xl mx-auto p-4">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <Card className="shadow-lg rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              ['First Name', 'first_name'],
              ['Last Name',  'last_name'],
              ['Date of Birth', 'dob'],
              ['Gender', 'gender'],
              ['Address', 'address'],
              ['Phone', 'phone']
            ].map(([label, name]) => (
              <div key={name}>
                <label className="block font-medium mb-1">{label}</label>
                {name === 'gender' ? (
                  <select
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                ) : name === 'address' ? (
                  <textarea
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                ) : (
                  <input
                    type={name === 'dob' ? 'date' : 'text'}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                )}
              </div>
            ))}

            <div className="text-center pt-4">
              <Button onClick={handleSave} disabled={saving} className="rounded-2xl">
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
