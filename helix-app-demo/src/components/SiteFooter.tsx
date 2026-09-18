import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return <footer className="site-footer">
    <span>© 2026 Helix Saúde</span>
    <nav aria-label="Links institucionais">
      <a href="#privacidade">Privacidade</a>
      <a href="#termos">Termos</a>
      <a href="#seguranca">Segurança</a>
      <Link to="/gerenciamento">Gerenciamento</Link>
    </nav>
  </footer>
}
