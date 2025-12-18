import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post(
        'http://localhost:5000/api/login', // Directly call your Flask API
        {
          username: form.username,
          password_hash: form.password, // Send as password_hash because Flask expects it this way
        },
        { withCredentials: true }
      )
      router.push('/dashboard') // Redirect after login
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="container mx-auto max-w-md p-4 bg-white rounded shadow mt-10">
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Username
          <input
            name="username"
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </label>
        <label className="block mb-4">
          Password
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </label>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}
