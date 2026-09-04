import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
    const [cpfEmail, setCpfEmail] = useState('')
    const [senha, setSenha] = useState('')
    const {login} = useAuth()
    const navigate = useNavigate()

    function handleSubmit(event: React.FormEvent) {
        e.preventDefault()
        login()
        navigate('/perfil')
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className='w-full max-w-sm bg-neutral-900 rounded-2xl p-8 border border-neutral-800'>
                
                <div className='text-center mb-8'>
                    <h1 className='text-2xl font-bold text-helix-lightgreen'>Helix.</h1>
                    <p className='text-sm text-neutral-400 mt-1'>O cuidado começa no DNA</p>
                </div>
                <h2 className='text-lg font-semibold mb-1'>Bem Vindo de volta</h2>
                <p className='text-sm text-neutral-400 mb-6'>Acesse seu perfil genômico Unimed</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">CPF ou e-mail</label>
            <input
              type="text"
              value={cpfEmail}
              onChange={(e) => setCpfEmail(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-helix-green"
              placeholder="ana.carolina@email.com"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-helix-green"
              placeholder="••••••••"
            />
            <Link to="#" className="text-xs text-helix-lightgreen mt-1 inline-block hover:underline">
              Esqueci minha senha
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-helix-green hover:bg-helix-lightgreen transition-colors text-white font-medium py-2 rounded-lg"
          >
            Entrar
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-neutral-800 flex-1" />
          <span className="text-xs text-neutral-500">ou acesse com</span>
          <div className="h-px bg-neutral-800 flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="border border-neutral-700 rounded-lg py-2 text-sm hover:bg-neutral-800">
            Google
          </button>
          <button className="border border-neutral-700 rounded-lg py-2 text-sm hover:bg-neutral-800">
            Carteira Unimed
          </button>
        </div>

        <p className="text-center text-sm text-neutral-400 mt-6">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="text-helix-lightgreen hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}