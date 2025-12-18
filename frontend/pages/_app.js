// pages/_app.js
import '../styles/globals.css'
import Layout from '../components/Layout'
import ChatBubble from '../components/ChatBubble'
import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter()

  // Public pages without Layout
  const publicRoutes = ['/', '/login', '/register']
  const isPublicPage = publicRoutes.includes(pathname)

  return (
    <ThemeProvider>
      <AuthProvider>
        <>
          {isPublicPage ? (
            <>
              <Component {...pageProps} />
            </>
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
          {/* Show globally: */}
          <ChatBubble />
          <ThemeToggle />
        </>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default MyApp
