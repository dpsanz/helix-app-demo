import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authenticate } from '../../data/helixDb'
import { useAuth } from '../../hooks/useAuth'
import type { AccessRole } from '../../hooks/useAuth'

export default function Login() {
  const [cpfEmail, setCpfEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [role, setRole] = useState<AccessRole>('beneficiary')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const user = await authenticate(cpfEmail, senha, role)
      if (!user) { setError('E-mail/CPF, senha ou tipo de acesso inválido.'); return }
      login(user.id, user.role)
      navigate(user.role === 'doctor' ? '/portal-medico' : '/perfil')
    } catch {
      setError('Não foi possível acessar o banco local do navegador.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="login-page min-h-screen flex items-center justify-center px-4">
    <div className="login-card w-full max-w-sm rounded-2xl p-8">
      <div className="login-brand"><img src="/logo.svg" alt="" /><strong>HELIX</strong></div>
      <h1 className="text-lg font-semibold mb-1 text-center">Bem-vindo de volta</h1>
      <p className="text-sm text-neutral-400 mb-5 text-center">Acesse sua conta Helix</p>
      <div className="grid grid-cols-2 gap-2 mb-5" role="group" aria-label="Tipo de acesso">
        <button type="button" onClick={() => { setRole('beneficiary'); setError('') }} className={`access-option ${role === 'beneficiary' ? 'access-option-active' : ''}`}>Beneficiário</button>
        <button type="button" onClick={() => { setRole('doctor'); setError('') }} className={`access-option ${role === 'doctor' ? 'access-option-active' : ''}`}>Médico cooperado</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="text-xs text-neutral-400 mb-1 block">CPF ou e-mail</label><input type="text" value={cpfEmail} onChange={event => setCpfEmail(event.target.value)} className="login-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="voce@email.com" autoComplete="username" required /></div>
        <div><label className="text-xs text-neutral-400 mb-1 block">Senha</label><input type="password" value={senha} onChange={event => setSenha(event.target.value)} className="login-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="••••••••" autoComplete="current-password" required /></div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className="helix-button-hover w-full bg-helix-green hover:bg-helix-lightgreen text-white font-medium py-2 rounded-lg">{loading ? 'Entrando…' : 'Entrar'}</button>
      </form>
      {role === 'doctor' && <div className="doctor-demo-access"><span>Acesso médico demonstrativo</span><button type="button" onClick={() => { setCpfEmail('medico@helix.com'); setSenha('medico123') }}>Preencher credenciais</button></div>}
      <p className="text-center text-sm text-neutral-400 mt-6">Ainda não tem conta? <Link to="/cadastro" className="text-helix-lightgreen hover:underline">Criar conta</Link></p>
      <p className="login-storage-note">Contas e perfis ficam salvos com segurança local neste navegador.</p>
    </div>
  </div>
}
