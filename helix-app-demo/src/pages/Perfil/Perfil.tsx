import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, initials, updateUser } from '../../data/helixDb'
import type { HelixUser } from '../../data/helixDb'
import { useAuth } from '../../hooks/useAuth'

export default function Perfil() {
  const [user, setUser] = useState<HelixUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCompatibility, setShowCompatibility] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ phone: '', medication: '' })
  const { logout, userId } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) return
    getUser(userId).then(profile => {
      setUser(profile)
      if (profile) setDraft({ phone: profile.phone ?? '', medication: profile.health?.medication ?? '' })
    }).finally(() => setLoading(false))
  }, [userId])

  const leave = () => { logout(); navigate('/') }
  const saveProfile = async () => {
    if (!user) return
    const updated = await updateUser(user.id, {
      phone: draft.phone,
      health: { conditions: user.health?.conditions ?? [], allergies: user.health?.allergies ?? [], familyHistory: user.health?.familyHistory ?? [], medication: draft.medication },
      patientStatus: draft.medication ? 'alerta' : 'ok',
    })
    setUser(updated); setEditing(false)
  }

  if (loading) return <div className="app-loading"><img src="/logo.svg" alt="" /><span>Carregando seu perfil…</span></div>
  if (!user) return <div className="app-loading"><p>Perfil não encontrado neste navegador.</p><button className="primary-btn" onClick={leave}>Voltar ao login</button></div>

  const medication = user.health?.medication || 'Nenhum medicamento informado'
  const hasMedication = Boolean(user.health?.medication)

  return <div className="app-shell">
    <header className="topbar"><div className="brand pro-brand"><img src="/logo.svg" alt="" /><div className="brand-lockup"><strong>HELIX</strong><span>BENEFICIÁRIO</span></div></div><div className="top-actions"><button className="ghost-btn" onClick={() => setEditing(true)}>Editar perfil</button><button className="ghost-btn" onClick={leave}>Sair</button></div></header>
    <main className="dashboard">
      <div className="demo-banner">Perfil salvo localmente neste navegador · ID {user.id}</div>
      <section className="profile-hero"><div className="avatar">{initials(user.name)}</div><div><span className="eyebrow">Perfil do beneficiário</span><h1>{user.name}</h1><p>{user.plan} · Carteirinha {user.cardNumber}</p></div><span className="status-ok">● {user.genomicStatus}</span></section>
      <section className="metric-grid beneficiary-metrics">
        <article className="metric-card"><span>Genes mapeados</span><strong>{String(user.genes?.length ?? 0).padStart(2, '0')}</strong><small>Painel farmacogenômico</small></article>
        <article className="metric-card"><span>Medicamentos</span><strong>{hasMedication ? '01' : '00'}</strong><small>Em acompanhamento</small></article>
        <article className={`metric-card ${hasMedication ? 'alert-metric' : ''}`}><span>Pontos de atenção</span><strong>{hasMedication ? '01' : '00'}</strong><small>{hasMedication ? 'Revisão recomendada' : 'Nenhum alerta'}</small></article>
        <article className="metric-card"><span>Status da análise</span><strong className="metric-text">Em preparo</strong><small>Cadastro concluído</small></article>
      </section>
      <div className="dashboard-grid">
        <section className="panel span-2"><div className="section-heading"><div><span className="eyebrow">Farmacogenômica</span><h2>Meu perfil genômico</h2></div><span className="muted">{user.email}</span></div><div className="gene-row">{user.genes?.map(gene => <span className="gene-chip" key={gene}>{gene}</span>)}</div><div className="kit-card"><div><strong>Kit salivar Helix</strong><p>Solicitação criada junto com o cadastro</p></div><span className="status-ok">Aguardando coleta</span></div></section>
        <section className="panel"><span className="eyebrow">Saúde</span><h2>Contexto informado</h2><div className="profile-facts"><div><small>Condições</small><strong>{user.health?.conditions.join(', ') || 'Não informado'}</strong></div><div><small>Alergias</small><strong>{user.health?.allergies.join(', ') || 'Não informado'}</strong></div><div><small>Contato</small><strong>{user.phone || 'Não informado'}</strong></div></div></section>
        <section className="panel span-2"><span className="eyebrow">Tratamento</span><h2>Meus medicamentos</h2><div className="medication-card"><div className="med-icon">Rx</div><div className="grow"><strong>{medication}</strong><p>{hasMedication ? 'Acompanhamento farmacogenômico disponível' : 'Edite seu perfil para adicionar um medicamento'}</p></div>{hasMedication && <><span className="status-alert">● Atenção</span><button className="primary-btn" onClick={() => setShowCompatibility(true)}>Ver compatibilidade</button></>}</div></section>
      </div>
    </main>

    {editing && <div className="modal-backdrop" onMouseDown={() => setEditing(false)}><section className="modal" role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}><button className="modal-close" onClick={() => setEditing(false)}>×</button><span className="eyebrow">Dados persistentes</span><h2>Editar perfil</h2><p className="modal-lead">As alterações também aparecerão para o médico vinculado.</p><div className="edit-fields"><label><span>Celular</span><input value={draft.phone} onChange={event => setDraft({ ...draft, phone: event.target.value })} /></label><label><span>Medicamento em uso</span><input value={draft.medication} onChange={event => setDraft({ ...draft, medication: event.target.value })} placeholder="Ex.: Losartana 50 mg" /></label></div><div className="modal-actions"><button className="secondary-btn" onClick={() => setEditing(false)}>Cancelar</button><button className="primary-btn" onClick={saveProfile}>Salvar alterações</button></div></section></div>}
    {showCompatibility && <div className="modal-backdrop" onMouseDown={() => setShowCompatibility(false)}><section className="modal" role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}><button className="modal-close" onClick={() => setShowCompatibility(false)}>×</button><span className="status-alert">Atenção farmacogenômica</span><h2>{medication}</h2><p className="modal-lead">Revisão recomendada</p><div className="info-block"><small>Genes relacionados</small><div className="gene-row">{user.genes?.slice(0, 2).map(gene => <span className="gene-chip" key={gene}>{gene}</span>)}</div></div><p>O perfil cadastrado indica que este medicamento deve ser acompanhado pelo profissional responsável.</p><div className="recommendation"><strong>Recomendação</strong><p>Converse com seu médico antes de iniciar, interromper ou alterar a dose.</p></div><button className="primary-btn full" onClick={() => setShowCompatibility(false)}>Entendi</button></section></div>}
  </div>
}
