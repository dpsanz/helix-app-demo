import { useCallback, useEffect, useState } from 'react'

export type AccessRole = 'beneficiary' | 'doctor'
const SESSION_KEY = 'helix_demo_session'
type Session = { isAuthenticated: boolean; role: AccessRole | null }

function readSession(): Session {
  try {
    const saved = localStorage.getItem(SESSION_KEY)
    if (saved) return JSON.parse(saved) as Session
  } catch { localStorage.removeItem(SESSION_KEY) }
  return { isAuthenticated: false, role: null }
}

export function useAuth() {
  const [session, setSession] = useState<Session>(readSession)
  useEffect(() => {
    const sync = () => setSession(readSession())
    window.addEventListener('helix-session-change', sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener('helix-session-change', sync); window.removeEventListener('storage', sync) }
  }, [])
  const save = useCallback((next: Session) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(next)); setSession(next)
    window.dispatchEvent(new Event('helix-session-change'))
  }, [])
  const login = (role: AccessRole) => save({ isAuthenticated: true, role })
  const logout = () => { localStorage.removeItem(SESSION_KEY); setSession({ isAuthenticated: false, role: null }); window.dispatchEvent(new Event('helix-session-change')) }
  return { ...session, login, logout }
}
