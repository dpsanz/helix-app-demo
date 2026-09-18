import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authenticate } from '../../data/helixDb'
import { useAuth } from '../../hooks/useAuth'
import type { AccessRole } from '../../hooks/useAuth'

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5.5 5.8v5.5c0 4.1 2.7 7.8 6.5 9.2 3.8-1.4 6.5-5.1 6.5-9.2V5.8L12 3Z" /><path d="m9.2 12 1.8 1.8 4-4" /></svg>
}

export default function Login() {
  const [cpfEmail, setCpfEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [role, setRole] = useState<AccessRole>('beneficiary')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { window.scrollTo(0, 0) }, [])

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

  return <main className="login-page page-enter">
    <header className="auth-nav">
      <Link to="/" className="signup-brand" aria-label="Helix — início"><img src="/logo.svg" alt="" /><div><strong>HELIX</strong></div></Link>
      <Link to="/cadastro" className="auth-create-link">Não possui uma conta? <span>Criar perfil</span></Link>
    </header>

    <section className="login-layout">
      <aside className="login-context">
        <span className="signup-kicker">PLATAFORMA GENÔMICA · ACESSO SEGURO</span>
        <h1>Seu perfil de saúde,<br /><em>em um só lugar.</em></h1>
        <p>Acesse informações farmacogenômicas, medicamentos acompanhados e o histórico compartilhado com seu médico.</p>
        <div className="login-feature-list">
          <div><span>01</span><p><strong>Dados centralizados</strong>Perfil clínico e genômico organizados para consulta.</p></div>
          <div><span>02</span><p><strong>Acompanhamento conectado</strong>As atualizações ficam disponíveis ao médico vinculado.</p></div>
          <div><span>03</span><p><strong>Armazenamento local</strong>Esta demonstração mantém suas contas neste navegador.</p></div>
        </div>
      </aside>

      <div className="login-card ui-card">
        <div className="login-card-heading"><div className="login-brand"><img src="/logo.svg" alt="" /></div><span>Acesso à plataforma</span><h2>Bem-vindo de volta</h2><p>Entre com as credenciais do seu perfil.</p></div>
        <div className="login-role-tabs" role="group" aria-label="Tipo de acesso">
          <button type="button" onClick={() => { setRole('beneficiary'); setError('') }} className={`access-option ${role === 'beneficiary' ? 'access-option-active' : ''}`}>Beneficiário</button>
          <button type="button" onClick={() => { setRole('doctor'); setError('') }} className={`access-option ${role === 'doctor' ? 'access-option-active' : ''}`}>Médico cooperado</button>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <label><span>CPF ou e-mail</span><input type="text" value={cpfEmail} onChange={event => setCpfEmail(event.target.value)} className="login-input" placeholder="voce@email.com" autoComplete="username" required /></label>
          <label><span>Senha</span><input type="password" value={senha} onChange={event => setSenha(event.target.value)} className="login-input" placeholder="••••••••" autoComplete="current-password" required /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="login-submit">{loading ? 'Entrando…' : 'Entrar'}<span>→</span></button>
        </form>
        {role === 'doctor' && <div className="doctor-demo-access"><span>Acesso médico demonstrativo</span><button type="button" onClick={() => { setCpfEmail('medico@helix.com'); setSenha('medico123') }}>Usar credenciais</button></div>}
        <div className="login-security"><ShieldIcon /><p><strong>Sessão protegida</strong>Suas informações permanecem vinculadas somente a este navegador.</p></div>
      </div>
    </section>
    <footer className="signup-footer"><span>© 2026 Helix Saúde</span><span>Privacidade · Termos · Segurança</span></footer>
  </main>
}
