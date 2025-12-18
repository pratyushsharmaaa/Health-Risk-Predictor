import Head from 'next/head'
import { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import { ThemeContext } from '../context/ThemeContext'

export default function Home() {
  const [message, setMessage] = useState('')
  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    setMessage("Welcome to Health Risk Prediction! Please login or register.")
  }, [])

  return (
    <>
      <Head>
        <title>Healthcare App</title>
      </Head>
      <div
        className={`flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center bg-no-repeat transition-colors duration-500 ${
          theme === 'dark' ? 'bg-black text-white' : ''
        }`}
        style={{
          backgroundImage:
            theme === 'dark'
              ? "url('/images/health-bg-dark.jpg')" // Add this image if desired
              : "url('/images/health-bg.jpg')"
        }}
      >
        <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 p-8 rounded-lg shadow-xl text-center max-w-2xl transition-all duration-500">
          <h1 className="text-4xl font-bold mb-6 text-blue-700 dark:text-blue-300 animate-pulse">
            {message}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Upload your reports, get automated health insights powered by AI, and manage your wellness journey.
          </p>
          <div className="flex gap-6 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
