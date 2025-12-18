// pages/register.js
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    address: '',
    phone: ''
  })
  const [error, setError] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      await axios.post(
        'http://localhost:5000/api/register',
        {
          username:     form.username,
          password_hash: form.password,
          first_name:   form.first_name,
          last_name:    form.last_name,
          dob:          form.dob,
          gender:       form.gender,
          address:      form.address,
          phone:        form.phone
        },
        { withCredentials: true }
      )
      router.push('/login')
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Username & Password */}
        <div>
          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* First & Last Name */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label>First Name</label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex-1">
            <label>Last Name</label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        {/* DOB & Gender */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex-1">
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select…</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Address & Phone */}
        <div>
          <label>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  )
}
