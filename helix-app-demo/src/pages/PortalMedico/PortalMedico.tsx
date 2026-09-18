import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, listDoctorPatients, medicationLabel, updateUser } from '../../data/helixDb'
import type { HelixUser, PatientStatus } from '../../data/helixDb'
import { useAuth } from '../../hooks/useAuth'
import UserAvatar from '../../components/UserAvatar'
import DashboardSidebar from '../../components/DashboardSidebar'
import DoctorAgenda from '../../components/DoctorAgenda'

type Filter = 'todos' | PatientStatus

export default function PortalMedico() {
  const [doctor, setDoctor] = useState<HelixUser | null>(null)
  const [patients, setPatients] = useState<HelixUser[]>([])
  const [filter, setFilter] = useState<Filter>('todos')
  const [selected, setSelected] = useState<HelixUser | null>(null)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const { logout, userId } = useAuth()
  const navigate = useNavigate()

  const load = useCallback(async () => {
    if (!userId) return
    const [doctorProfile, linkedPatients] = await Promise.all([getUser(userId), listDoctorPatients(userId)])
    setDoctor(doctorProfile); setPatients(linkedPatients); setLoading(false)
  }, [userId])

  useEffect(() => {
    if (!userId) return
    let active = true
    Promise.all([getUser(userId), listDoctorPatients(userId)]).then(([doctorProfile, linkedPatients]) => {
      if (!active) return
      setDoctor(doctorProfile); setPatients(linkedPatients); setLoading(false)
    })
    return () => { active = false }
  }, [userId])
  useEffect(() => {
    const refresh = () => { load() }
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [load])
  useEffect(() => {
    if (!selected) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [selected])

  const leave = () => { logout(); navigate('/') }
  const filtered = filter === 'todos' ? patients : patients.filter(patient => patient.patientStatus === filter)
  const alertCount = patients.filter(patient => patient.patientStatus === 'alerta').length

  const resolveAlert = async () => {
    if (!selected) return
    const updated = await updateUser(selected.id, { patientStatus: 'ok' })
    setSelected(updated)
    setFeedback('Revisão registrada. O status do paciente foi atualizado.')
    await load()
  }

  if (loading) return <div className="app-loading"><img src="/logo.svg" alt="" /><span>Carregando pacientes…</span></div>
  if (!doctor) return <div className="app-loading"><p>Conta médica não encontrada.</p><button className="primary-btn" onClick={leave}>Voltar ao login</button></div>

  return <div className="app-shell medical page-enter">
    <DashboardSidebar userId={doctor.id} name={doctor.name} photoDataUrl={doctor.photoDataUrl} role="doctor" onPrimaryAction={load} onLogout={leave} />
    <main className="dashboard">
      <div className="demo-banner">Portal médico local · Novas contas beneficiárias aparecem automaticamente aqui</div>
      <section className="profile-hero" id="overview"><UserAvatar userId={doctor.id} name={doctor.name} photoDataUrl={doctor.photoDataUrl} /><div><span className="eyebrow">Médico cooperado</span><h1>{doctor.name}</h1><p>CRM-SP 85442 · Cardiologia</p></div><span className="status-ok">● Cadastro validado</span></section>
      <section className="metric-grid doctor-metrics">
        <article className="metric-card"><span>Pacientes vinculados</span><strong>{patients.length.toString().padStart(2, '0')}</strong><small>Contas neste navegador</small></article>
        <article className="metric-card alert-metric"><span>Alertas genômicos</span><strong>{alertCount.toString().padStart(2, '0')}</strong><small>Pedem atenção</small></article>
        <article className="metric-card"><span>Compatíveis</span><strong>{patients.filter(patient => patient.patientStatus === 'ok').length.toString().padStart(2, '0')}</strong><small>Sem alertas ativos</small></article>
        <article className="metric-card"><span>Status profissional</span><strong className="metric-text">Validado</strong><small>Cadastro cooperado ativo</small></article>
      </section>
      <DoctorAgenda patients={patients} onSelect={patient => { setSelected(patient); setFeedback('') }} />
      <section className="panel" id="patients"><div className="section-heading"><div><span className="eyebrow">Minha carteira</span><h2>Pacientes vinculados</h2></div><div className="filters">{([['todos','Todos'],['alerta','Alertas'],['ok','OK']] as const).map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={filter === value ? 'filter-active' : ''}>{label}{value === 'alerta' && ` (${alertCount})`}</button>)}</div></div>
        {filtered.length === 0 ? <div className="empty-patients"><span>+</span><strong>{patients.length ? 'Nenhum paciente neste filtro' : 'Nenhum paciente vinculado ainda'}</strong><p>Crie uma conta de beneficiário e ela aparecerá aqui.</p></div> : <div className="patient-list">{filtered.map((patient, index) => <button className="patient-row" key={patient.id} onClick={() => { setSelected(patient); setFeedback('') }}><span className="patient-time">{String(9 + index).padStart(2, '0')}:00</span><UserAvatar userId={patient.id} name={patient.name} photoDataUrl={patient.photoDataUrl} size="small" /><span className="grow patient-name"><strong>{patient.name}</strong><small>{patient.id} · {medicationLabel(patient.health) || 'Sem medicamento'}</small></span><span className={patient.patientStatus === 'alerta' ? 'status-alert' : 'status-ok'}>● {patient.patientStatus === 'alerta' ? 'Alerta' : 'Compatível'}</span><span className="arrow">›</span></button>)}</div>}
      </section>
    </main>
    {selected && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><section className="modal wide" role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}>×</button><span className={selected.patientStatus === 'alerta' ? 'status-alert' : 'status-ok'}>{selected.patientStatus === 'alerta' ? 'Alerta de acompanhamento' : 'Sem alerta ativo'}</span><h2>{selected.name}</h2><p className="modal-lead">{selected.id} · {selected.plan}</p><div className="patient-detail-grid"><div><small>Contato</small><strong>{selected.phone || 'Não informado'}</strong></div><div><small>Carteirinha</small><strong>{selected.cardNumber || 'Não informada'}</strong></div><div><small>Condições</small><strong>{selected.health?.conditions.join(', ') || 'Nenhuma informada'}</strong></div><div><small>Alergias</small><strong>{selected.health?.allergies.join(', ') || 'Nenhuma informada'}</strong></div></div><div className="info-block"><small>Medicamento em uso</small><strong>{medicationLabel(selected.health) || 'Nenhum medicamento informado'}</strong><div className="gene-row">{selected.genes?.map(gene => <span className="gene-chip" key={gene}>{gene}</span>)}</div></div>{selected.patientStatus === 'alerta' && <div className="recommendation"><strong>Atenção clínica</strong><p>Revise o medicamento informado considerando o contexto e o perfil genômico do paciente.</p></div>}{feedback ? <div className="success-message">✓ {feedback}</div> : <div className="modal-actions"><button className="secondary-btn" onClick={() => setSelected(null)}>Fechar</button>{selected.patientStatus === 'alerta' && <button className="primary-btn" onClick={resolveAlert}>Marcar como revisado</button>}</div>}</section></div>}
  </div>
}
