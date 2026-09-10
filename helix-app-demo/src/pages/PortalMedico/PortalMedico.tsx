import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { beneficiary, demoDisclaimer, doctor, patients } from '../../data/mockData'
import type { Patient, PatientStatus } from '../../data/mockData'
import { useAuth } from '../../hooks/useAuth'

type Filter = 'todos' | PatientStatus
export default function PortalMedico() {
  const [filter, setFilter] = useState<Filter>('todos'); const [selected, setSelected] = useState<Patient | null>(null); const [feedback, setFeedback] = useState('')
  const { logout, login } = useAuth(); const navigate = useNavigate()
  const filtered = filter === 'todos' ? patients : patients.filter(p => p.status === filter)
  const leave = () => { logout(); navigate('/') }; const beneficiaryAccess = () => { login('beneficiary'); navigate('/perfil') }
  const action = (message: string) => { setFeedback(message); window.setTimeout(() => setFeedback(''), 3500) }
  return <div className="app-shell medical"><header className="topbar"><div className="brand"><img src="/logo.svg" alt="" />HELIX <span>PRO</span></div><div className="top-actions"><button className="ghost-btn" onClick={beneficiaryAccess}>Ver área da Ana</button><button className="ghost-btn" onClick={leave}>Sair</button></div></header>
    <main className="dashboard"><div className="demo-banner">Portal médico demonstrativo · Dados clínicos e genômicos simulados</div><section className="profile-hero"><div className="avatar">{doctor.name.charAt(0)}C</div><div><span className="eyebrow">Médico cooperado</span><h1>{doctor.name}</h1><p>{doctor.crm} · {doctor.specialty}</p></div><span className="status-ok">● {doctor.status}</span></section>
      <section className="metric-grid doctor-metrics">
        <article className="metric-card"><span>Pacientes hoje</span><strong>{patients.length.toString().padStart(2, '0')}</strong><small>Agenda confirmada</small></article>
        <article className="metric-card alert-metric"><span>Alertas genômicos</span><strong>{patients.filter(p => p.status === 'alerta').length.toString().padStart(2, '0')}</strong><small>Pedem atenção</small></article>
        <article className="metric-card"><span>Compatíveis</span><strong>{patients.filter(p => p.status === 'ok').length.toString().padStart(2, '0')}</strong><small>Sem alertas demonstrativos</small></article>
      </section>
      <section className="panel"><div className="section-heading"><div><span className="eyebrow">Agenda de hoje</span><h2>Pacientes do dia</h2></div><div className="filters">{([['todos','Todos'],['alerta','Alertas'],['ok','OK']] as const).map(([value,label]) => <button key={value} onClick={() => setFilter(value)} className={filter === value ? 'filter-active' : ''}>{label}{value === 'alerta' && ` (${patients.filter(p => p.status === 'alerta').length})`}</button>)}</div></div>
        <div className="patient-list">{filtered.map(patient => <button className="patient-row" key={patient.id} onClick={() => { setSelected(patient); setFeedback('') }}><span className="patient-time">{patient.appointmentTime}</span><span className="avatar small">{patient.initials}</span><span className="grow patient-name"><strong>{patient.name}</strong><small>{patient.id} · {patient.medication}</small></span><span className={patient.status === 'alerta' ? 'status-alert' : 'status-ok'}>● {patient.status === 'alerta' ? 'Alerta' : 'Compatível'}</span><span className="arrow">›</span></button>)}</div>
      </section>
    </main>
    {selected && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><section className="modal wide" role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}>×</button><span className={selected.status === 'alerta' ? 'status-alert' : 'status-ok'}>{selected.status === 'alerta' ? 'Alerta de prescrição' : 'Sem alerta identificado'}</span><h2>{selected.name}</h2><p className="modal-lead">{selected.medication}</p>{selected.genes.length > 0 && <div className="info-block"><small>Genes relacionados</small><div className="gene-row">{selected.genes.map(g => <span className="gene-chip" key={g}>{g}</span>)}</div></div>}<p>{selected.alertSummary ?? 'Nenhuma incompatibilidade demonstrativa foi identificada para este medicamento.'}</p>{selected.id === beneficiary.id && <div className="recommendation"><strong>Atenção clínica demonstrativa</strong><p>O perfil pode indicar maior sensibilidade à varfarina. Avalie dose, acompanhamento e contexto clínico da paciente.</p></div>}<p className="disclaimer">{demoDisclaimer}</p>{feedback ? <div className="success-message">✓ {feedback}</div> : <div className="modal-actions"><button className="secondary-btn" onClick={() => action('Prescrição marcada para revisão.')}>Revisar prescrição</button><button className="primary-btn" onClick={() => action('Justificativa simulada registrada com sucesso.')}>Prosseguir com justificativa</button></div>}</section></div>}
  </div>
}
