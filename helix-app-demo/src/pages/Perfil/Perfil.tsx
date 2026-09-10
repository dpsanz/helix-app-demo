import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { beneficiary, demoDisclaimer } from '../../data/mockData'
import { useAuth } from '../../hooks/useAuth'

export default function Perfil() {
  const [showCompatibility, setShowCompatibility] = useState(false)
  const { logout, login } = useAuth(); const navigate = useNavigate()
  const leave = () => { logout(); navigate('/') }
  const doctorAccess = () => { login('doctor'); navigate('/portal-medico') }
  return <div className="app-shell">
    <header className="topbar"><div className="brand"><img src="/logo.svg" alt="" />HELIX</div><div className="top-actions"><button className="ghost-btn" onClick={doctorAccess}>Acesso médico</button><button className="ghost-btn" onClick={leave}>Sair</button></div></header>
    <main className="dashboard">
      <div className="demo-banner">Ambiente demonstrativo · Todos os dados exibidos são fictícios</div>
      <section className="profile-hero"><div className="avatar">{beneficiary.initials}</div><div><span className="eyebrow">Perfil do beneficiário</span><h1>{beneficiary.name}</h1><p>ID Helix {beneficiary.id} · {beneficiary.plan}</p></div><span className="status-ok">● {beneficiary.genomicStatus}</span></section>
      <section className="metric-grid beneficiary-metrics">
        <article className="metric-card"><span>Genes mapeados</span><strong>03</strong><small>Painel farmacogenômico</small></article>
        <article className="metric-card"><span>Medicamentos</span><strong>01</strong><small>Em acompanhamento</small></article>
        <article className="metric-card alert-metric"><span>Pontos de atenção</span><strong>01</strong><small>Revisão recomendada</small></article>
        <article className="metric-card"><span>Status da análise</span><strong className="metric-text">Concluída</strong><small>Perfil atualizado</small></article>
      </section>
      <div className="dashboard-grid">
        <section className="panel span-2"><div className="section-heading"><div><span className="eyebrow">Farmacogenômica</span><h2>Meu perfil genômico</h2></div><span className="muted">Carteirinha {beneficiary.cardNumber}</span></div><div className="gene-row">{beneficiary.genes.map(gene => <span className="gene-chip" key={gene}>{gene}</span>)}</div><div className="kit-card"><div><strong>{beneficiary.kit.name}</strong><p>Coletado em {beneficiary.kit.collectedAt} · Processado em {beneficiary.kit.processedAt}</p></div><span className="status-ok">{beneficiary.kit.status}</span></div></section>
        <section className="panel"><span className="eyebrow">Linha do tempo</span><h2>Histórico recente</h2><div className="timeline">{beneficiary.history.map(item => <div className="timeline-item" key={item.date}><span></span><div><small>{item.date}</small><strong>{item.title}</strong><p>{item.description}</p></div></div>)}</div></section>
        <section className="panel span-2"><span className="eyebrow">Tratamento</span><h2>Meus medicamentos</h2><div className="medication-card"><div className="med-icon">Rx</div><div className="grow"><strong>{beneficiary.medication.name}</strong><p>Resultado farmacogenômico disponível</p></div><span className="status-alert">● {beneficiary.medication.status}</span><button className="primary-btn" onClick={() => setShowCompatibility(true)}>Ver compatibilidade</button></div></section>
      </div>
    </main>
    {showCompatibility && <div className="modal-backdrop" onMouseDown={() => setShowCompatibility(false)}><section className="modal" role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowCompatibility(false)} aria-label="Fechar">×</button><span className="status-alert">Atenção farmacogenômica</span><h2>{beneficiary.medication.name}</h2><p className="modal-lead">{beneficiary.medication.attentionLevel}</p><div className="info-block"><small>Genes envolvidos</small><div className="gene-row">{beneficiary.medication.genes.map(g => <span className="gene-chip" key={g}>{g}</span>)}</div></div><p>{beneficiary.medication.explanation}</p><div className="recommendation"><strong>Recomendação</strong><p>{beneficiary.medication.recommendation}</p></div><p className="disclaimer">{demoDisclaimer}</p><button className="primary-btn full" onClick={() => setShowCompatibility(false)}>Entendi</button></section></div>}
  </div>
}
