// frontend/components/Layout.jsx
import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/logout`,
      {},
      { withCredentials: true }
    )
    router.push('/')  // Redirect to home on logout
  }

  // Extract first name
  const firstName = user?.first_name?.split(' ')[0] || ''

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors">
      <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between z-10">
        {/* Left: Greeting + nav */}
        <div className="flex items-center space-x-6">
          {!loading && user && (
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Hello, {firstName}!
            </span>
          )}

          <Link
            href="/dashboard"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            My Profile
          </Link>
        </div>

        {/* Centered title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-800 dark:text-gray-200">
          LIVER HEALTH PREDICTOR
        </h1>

        {/* Right: Edit icon + logout */}
        <div className="flex items-center space-x-4">
          <Link
            href="/profile/edit"
            title="Edit Profile"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✏️
          </Link>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            🚪
          </button>
        </div>
      </header>

      <main className="p-6">{children}</main>
    </div>
  )
}
