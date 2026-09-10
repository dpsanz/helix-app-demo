import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { AccessRole } from '../../hooks/useAuth'

export default function Login() {
  const [cpfEmail, setCpfEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [role, setRole] = useState<AccessRole>('beneficiary')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); login(role)
    navigate(role === 'doctor' ? '/portal-medico' : '/perfil')
  }

  return <div className="login-page min-h-screen flex items-center justify-center px-4">
    <div className="login-card w-full max-w-sm rounded-2xl p-8">
      <div className="text-center mb-6"><img src="/logo.svg" alt="Helix" className="mx-auto" width="40" height="40" /></div>
      <h1 className="text-lg font-semibold mb-1 text-center">Bem-vindo de volta</h1>
      <p className="text-sm text-neutral-400 mb-5 text-center">Acesse a plataforma genômica Helix</p>
      <div className="grid grid-cols-2 gap-2 mb-5" role="group" aria-label="Tipo de acesso">
        <button type="button" onClick={() => setRole('beneficiary')} className={`access-option ${role === 'beneficiary' ? 'access-option-active' : ''}`}>Beneficiário</button>
        <button type="button" onClick={() => setRole('doctor')} className={`access-option ${role === 'doctor' ? 'access-option-active' : ''}`}>Médico cooperado</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="text-xs text-neutral-400 mb-1 block">CPF ou e-mail</label><input type="text" value={cpfEmail} onChange={e => setCpfEmail(e.target.value)} className="login-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-helix-green" placeholder="seu.nome@endereco.com" required /></div>
        <div><label className="text-xs text-neutral-400 mb-1 block">Senha</label><input type="password" value={senha} onChange={e => setSenha(e.target.value)} className="login-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-helix-green" placeholder="••••••••" required /><Link to="#" className="text-xs text-helix-lightgreen mt-1 inline-block hover:underline">Esqueci minha senha</Link></div>
        <button type="submit" className="helix-button-hover w-full bg-helix-green hover:bg-helix-lightgreen text-white font-medium py-2 rounded-lg">Entrar</button>
      </form>
      <div className="flex items-center gap-3 my-6"><div className="h-px bg-neutral-800 flex-1" /><span className="text-xs text-neutral-500">ou acesse com</span><div className="h-px bg-neutral-800 flex-1" /></div>
      <div className="grid grid-cols-2 gap-3"><button className="helix-button-hover border border-neutral-700 rounded-lg py-2 text-sm hover:bg-neutral-800">Google</button><button className="helix-button-hover border border-neutral-700 rounded-lg py-2 text-sm hover:bg-neutral-800">Carteira Unimed</button></div>
      <p className="text-center text-sm text-neutral-400 mt-6">Ainda não tem conta? <Link to="/cadastro" className="text-helix-lightgreen hover:underline">Criar conta</Link></p>
      <p className="demo-note">Demonstração com dados totalmente simulados.</p>
    </div>
  </div>
}
