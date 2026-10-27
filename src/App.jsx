
import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Destinations from './components/Destinations'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

  // Restore the user's session when the page loads
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  async function handleLogout() {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Logout failed.')
      }

      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Unable to log out. Please try again.')
    }
  }

  return (
    <>
      <Header
        user={user}
        checkingSession={checkingSession}
        onLogin={() => setAuthMode('login')}
        onSignup={() => setAuthMode('signup')}
        onLogout={handleLogout}
      />

      <main>
        <Hero />

        <section
          aria-label="Our travel approach"
          className="grid grid-cols-1 gap-5 border-y border-slate-200 px-6 py-8 sm:grid-cols-3 sm:px-10 lg:px-16"
        >
          <p className="text-sm font-medium text-slate-700">
            <span className="mr-3 font-bold text-emerald-600">01</span>
            Thoughtfully curated trips
          </p>

          <p className="text-sm font-medium text-slate-700">
            <span className="mr-3 font-bold text-emerald-600">02</span>
            Local experiences
          </p>

          <p className="text-sm font-medium text-slate-700">
            <span className="mr-3 font-bold text-emerald-600">03</span>
            Memories that stay
          </p>
        </section>

        <Destinations />
      </main>

      <Footer />

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={(loggedInUser) => setUser(loggedInUser)}
        />
      )}
    </>
  )
}

export default App

