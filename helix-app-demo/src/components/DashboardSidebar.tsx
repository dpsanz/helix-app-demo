import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import UserAvatar from './UserAvatar'

type SidebarIcon = 'overview' | 'profile' | 'care' | 'patients' | 'calendar' | 'refresh' | 'edit' | 'logout'
type NavItem = { label: string; icon: SidebarIcon; to?: string; sectionId?: string; onClick?: () => void }
type Props = {
  userId: string
  name: string
  photoDataUrl?: string
  role: 'beneficiary' | 'doctor'
  onPrimaryAction: () => void
  onLogout: () => void
  primaryTargetId?: string
}

function Icon({ name }: { name: SidebarIcon }) {
  const paths: Record<SidebarIcon, ReactNode> = {
    overview: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6" /></>,
    profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" /></>,
    care: <><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" /><path d="M8.5 12h2l1-2.2 1.4 4.4 1.1-2.2h1.5" /></>,
    patients: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.5-3.5 2.3-5.3 5.5-5.3s5 1.8 5.5 5.3" /><circle cx="17" cy="9" r="2" /><path d="M16 14.3c2.8-.2 4.3 1.4 4.6 4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4M17 3v4M3 10h18M8 14h3M14 14h2M8 18h2" /></>,
    refresh: <><path d="M20 7v5h-5" /><path d="M18.5 16a8 8 0 1 1 .8-7.2L20 12" /></>,
    edit: <><path d="m14 5 5 5" /><path d="m4 20 3.5-.7L19 7.8a2 2 0 0 0-2.8-2.8L4.7 16.5 4 20Z" /></>,
    logout: <><path d="M10 5H5v14h5" /><path d="M14 8l4 4-4 4M18 12H9" /></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

export default function DashboardSidebar({ userId, name, photoDataUrl, role, onPrimaryAction, onLogout, primaryTargetId }: Props) {
  const isDoctor = role === 'doctor'
  const location = useLocation()
  const dashboardPath = isDoctor ? '/portal-medico' : '/perfil'
  const [activeSection, setActiveSection] = useState('overview')
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const items: NavItem[] = isDoctor
    ? [
        { label: 'Visão geral', icon: 'overview', to: '/portal-medico#overview', sectionId: 'overview' },
        { label: 'Agenda', icon: 'calendar', to: '/portal-medico#agenda', sectionId: 'agenda' },
        { label: 'Pacientes', icon: 'patients', to: '/portal-medico#patients', sectionId: 'patients' },
        { label: 'Atualizar dados', icon: 'refresh', onClick: onPrimaryAction },
      ]
    : [
        { label: 'Visão geral', icon: 'overview', to: '/perfil#overview', sectionId: 'overview' },
        { label: 'Minha saúde', icon: 'profile', to: '/perfil#health', sectionId: 'health' },
        { label: 'Medicamentos', icon: 'care', to: '/medicamentos' },
        { label: 'Editar perfil', icon: 'edit', onClick: onPrimaryAction },
      ]

  useEffect(() => {
    if (location.pathname !== dashboardPath) {
      setActiveSection('')
      return
    }
    const sectionIds = isDoctor ? ['overview', 'agenda', 'patients'] : ['overview', 'health', 'treatment']
    const updateActiveSection = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        setActiveSection(sectionIds.at(-1) ?? 'overview')
        return
      }
      const marker = window.innerHeight * .38
      const visible = sectionIds
        .map(id => document.getElementById(id))
        .filter((section): section is HTMLElement => Boolean(section))
        .filter(section => section.getBoundingClientRect().top <= marker)
        .at(-1)
      setActiveSection(visible?.id ?? 'overview')
    }
    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [dashboardPath, isDoctor, location.pathname])

  const runPrimaryAction = () => {
    onPrimaryAction()
    if (!primaryTargetId) return
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = document.getElementById(primaryTargetId) ?? document.querySelector<HTMLElement>(`.${primaryTargetId}`)
      target?.setAttribute('tabindex', '-1')
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target?.focus({ preventScroll: true })
    }))
  }

  return <aside className="topbar dashboard-sidebar" aria-label="Navegação do dashboard">
    <div className="brand pro-brand"><img src="/logo.svg" alt="" /><div className="brand-lockup"><strong>HELIX</strong><span>{isDoctor ? 'PROFISSIONAL' : 'BENEFICIÁRIO'}</span></div></div>
    <button className="sidebar-workspace" onClick={() => setWorkspaceOpen(open => !open)} aria-expanded={workspaceOpen} aria-controls="workspace-details">
      <span className="workspace-mark"><Icon name={isDoctor ? 'patients' : 'profile'} /></span>
      <span><strong>{isDoctor ? 'Painel clínico' : 'Meu espaço'}</strong><small>{isDoctor ? 'Área profissional' : 'Plano ativo'}</small></span>
    </button>
    <div className={`workspace-menu ${workspaceOpen ? 'open' : ''}`} id="workspace-details">
      <span>Conta atual</span><strong>{name}</strong><small>ID {userId}</small>
    </div>
    <nav className="sidebar-nav">
      <span className="sidebar-label">NAVEGAÇÃO</span>
      {items.map(item => item.to
        ? <Link key={item.label} className={`sidebar-link ${(item.sectionId ? location.pathname === dashboardPath && activeSection === item.sectionId : location.pathname === item.to) ? 'active' : ''}`} to={item.to} onClick={() => { if (item.sectionId) setActiveSection(item.sectionId) }}><Icon name={item.icon} /><span>{item.label}</span></Link>
        : <button key={item.label} className="sidebar-link" onClick={item.onClick === onPrimaryAction ? runPrimaryAction : item.onClick}><Icon name={item.icon} /><span>{item.label}</span></button>)}
    </nav>
    <div className="sidebar-footer">
      <div className="sidebar-user"><UserAvatar userId={userId} name={name} photoDataUrl={photoDataUrl} size="small" /><span><strong>{name}</strong><small>{isDoctor ? 'Médico cooperado' : 'Beneficiário'}</small></span></div>
      <button className="sidebar-logout" onClick={onLogout} aria-label="Sair da conta"><Icon name="logout" /></button>
    </div>
  </aside>
}
