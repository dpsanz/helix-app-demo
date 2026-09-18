import { Link } from 'react-router-dom'

export default function SignupHeader() {
  return <header className="signup-nav">
    <Link to="/" className="signup-brand" aria-label="Helix — início">
      <img src="/logo.svg" alt="" />
      <div><strong>HELIX</strong></div>
    </Link>
    <Link to="/" className="signup-login">Já tenho uma conta <span>Entrar</span></Link>
  </header>
}
