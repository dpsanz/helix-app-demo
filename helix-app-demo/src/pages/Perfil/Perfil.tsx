import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import GeneInsights from '../../components/GeneInsights'
import MedicationPicker from '../../components/MedicationPicker'
import TrendChart from '../../components/TrendChart'
import UserAvatar from '../../components/UserAvatar'
import DashboardSidebar from '../../components/DashboardSidebar'
import { ANDRE_GLUCOSE, ANDRE_WEIGHT } from '../../data/medicalKnowledge'
import { getUser, medicationLabel, updateUser } from '../../data/helixDb'
import type { HelixUser } from '../../data/helixDb'
import { useAuth } from '../../hooks/useAuth'

type Draft = { phone: string; medicationName: string; dosageMg: string; photoDataUrl: string }

function draftFromUser(user: HelixUser): Draft {
  const legacy = user.health?.medication.match(/^(.+?)\s+([\d.]+)\s*mg$/i)
  return {
    phone: user.phone ?? '',
    medicationName: user.health?.medicationName ?? legacy?.[1] ?? user.health?.medication ?? '',
    dosageMg: user.health?.dosageMg ?? legacy?.[2] ?? '',
    photoDataUrl: user.photoDataUrl ?? '',
  }
}

export default function Perfil() {
  const [user, setUser] = useState<HelixUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>({ phone: '', medicationName: '', dosageMg: '', photoDataUrl: '' })
  const [photoError, setPhotoError] = useState('')
  const { logout, userId } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!userId) return
    getUser(userId).then(profile => {
      setUser(profile)
      if (profile) setDraft(draftFromUser(profile))
    }).finally(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    if (!editing) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [editing])

  useEffect(() => {
    if (loading || !user) return
    if (new URLSearchParams(location.search).get('edit') === '1') {
      setDraft(draftFromUser(user))
      setPhotoError('')
      setEditing(true)
      navigate('/perfil', { replace: true })
      return
    }
    const targetId = location.hash.slice(1)
    if (!targetId) return
    const timer = window.setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
    return () => window.clearTimeout(timer)
  }, [loading, location.hash, location.search, navigate, user])

  const leave = () => { logout(); navigate('/') }
  const openEditor = () => { if (user) setDraft(draftFromUser(user)); setPhotoError(''); setEditing(true) }
  const saveProfile = async () => {
    if (!user) return
    const medication = `${draft.medicationName}${draft.dosageMg ? ` ${draft.dosageMg} mg` : ''}`.trim()
    const updated = await updateUser(user.id, {
      phone: draft.phone,
      photoDataUrl: draft.photoDataUrl,
      health: { conditions: user.health?.conditions ?? [], allergies: user.health?.allergies ?? [], familyHistory: user.health?.familyHistory ?? [], medication, medicationName: draft.medicationName, dosageMg: draft.dosageMg },
      patientStatus: medication ? 'alerta' : 'ok',
    })
    setUser(updated); setEditing(false)
  }

  const selectPhoto = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setPhotoError('Selecione um arquivo de imagem.'); return }
    if (file.size > 2 * 1024 * 1024) { setPhotoError('A foto deve ter no máximo 2 MB.'); return }
    const reader = new FileReader()
    reader.onload = () => { setDraft(current => ({ ...current, photoDataUrl: String(reader.result) })); setPhotoError('') }
    reader.readAsDataURL(file)
  }

  if (loading) return <div className="app-loading"><img src="/logo.svg" alt="" /><span>Carregando seu perfil…</span></div>
  if (!user) return <div className="app-loading"><p>Perfil não encontrado neste navegador.</p><button className="primary-btn" onClick={leave}>Voltar ao login</button></div>

  const medication = medicationLabel(user.health) || 'Nenhum medicamento informado'
  const hasMedication = Boolean(medicationLabel(user.health))
  const hasDiabetes = user.health?.conditions.some(condition => condition.toLowerCase().includes('diabet')) ?? false

  return <div className="app-shell page-enter">
    <DashboardSidebar userId={user.id} name={user.name} photoDataUrl={user.photoDataUrl} role="beneficiary" onPrimaryAction={openEditor} onLogout={leave} primaryTargetId="profile-editor" />
    <main className="dashboard">
      <div className="demo-banner">Perfil salvo localmente neste navegador · ID {user.id}</div>
      <section className="profile-hero" id="overview"><UserAvatar userId={user.id} name={user.name} photoDataUrl={user.photoDataUrl} /><div><span className="eyebrow">Perfil do beneficiário</span><h1>{user.name}</h1><p>{user.plan} · Carteirinha {user.cardNumber}</p></div><span className="status-ok">● {user.genomicStatus}</span></section>
      <section className="metric-grid beneficiary-metrics">
        <article className="metric-card"><span>Genes mapeados</span><strong>{String(user.genes?.length ?? 0).padStart(2, '0')}</strong><small>Painel farmacogenômico</small></article>
        <article className="metric-card"><span>Medicamentos</span><strong>{hasMedication ? '01' : '00'}</strong><small>{hasMedication ? `${user.health?.dosageMg || '—'} mg acompanhados` : 'Nenhum informado'}</small></article>
        <article className={`metric-card ${hasMedication ? 'alert-metric' : ''}`}><span>Pontos de atenção</span><strong>{hasMedication ? '01' : '00'}</strong><small>{hasMedication ? 'Revisão recomendada' : 'Nenhum alerta'}</small></article>
        <article className="metric-card"><span>Status da análise</span><strong className="metric-text">{user.genomicStatus?.includes('ativo') ? 'Ativo' : 'Em preparo'}</strong><small>Perfil atualizado</small></article>
      </section>

      {hasDiabetes && <section className="diabetes-overview panel"><div className="section-heading"><div><span className="eyebrow">Acompanhamento adaptativo</span><h2>Controle metabólico</h2></div><span className="diabetes-badge">Diabetes · acompanhamento ativo</span></div><p className="diabetes-lead">Indicadores demonstrativos organizados a partir do contexto de saúde informado.</p><div className="trend-grid"><TrendChart title="Glicemia" description="Média dos registros em jejum" data={ANDRE_GLUCOSE} unit="mg/dL" targetLabel="Meta: 80–130 mg/dL" /><TrendChart title="Peso" description="Evolução nos últimos cinco meses" data={ANDRE_WEIGHT} unit="kg" targetLabel="Tendência: −4,4 kg" /></div></section>}

      <div className="dashboard-grid">
        <section className="panel span-full"><div className="section-heading"><div><span className="eyebrow">Farmacogenômica explicada</span><h2>O que seus genes representam</h2></div><span className="muted">{user.genes?.length ?? 0} marcadores analisados</span></div><p className="gene-section-lead">Cada marcador é interpretado junto com seus medicamentos e condições de saúde. Ele não representa um diagnóstico isolado.</p><GeneInsights genes={user.genes} /><div className="kit-card"><div><strong>Kit salivar Helix</strong><p>Perfil integrado ao acompanhamento clínico</p></div><span className="status-ok">{user.genomicStatus}</span></div></section>
        <section className="panel" id="health"><span className="eyebrow">Saúde</span><h2>Contexto informado</h2><div className="profile-facts"><div><small>Condições</small><strong>{user.health?.conditions.join(', ') || 'Não informado'}</strong></div><div><small>Alergias</small><strong>{user.health?.allergies.join(', ') || 'Não informado'}</strong></div><div><small>Contato</small><strong>{user.phone || 'Não informado'}</strong></div></div></section>
        <section className="panel span-2" id="treatment"><span className="eyebrow">Tratamento</span><h2>Medicamento acompanhado</h2><div className="medication-card"><div className="med-icon">Rx</div><div className="grow"><strong>{medication}</strong><p>{hasMedication ? `${user.health?.medicationName || medication} · dose registrada em ${user.health?.dosageMg || '—'} mg` : 'Adicione um medicamento para acompanhar a dose e os alertas do seu perfil'}</p></div>{hasMedication && <span className="status-alert">● Acompanhar</span>}<button className="primary-btn" onClick={() => navigate('/medicamentos')}>Gerenciar medicamento</button></div></section>
      </div>
    </main>

    {editing && <div className="modal-backdrop" onMouseDown={() => setEditing(false)}><section className="modal profile-editor" role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}><button className="modal-close" onClick={() => setEditing(false)}>×</button><span className="eyebrow">Dados persistentes</span><h2>Editar perfil</h2><p className="modal-lead">As alterações também aparecerão para o médico vinculado.</p><div className="photo-editor"><UserAvatar userId={user.id} name={user.name} photoDataUrl={draft.photoDataUrl} /><div><label className="photo-upload">Escolher foto<input type="file" accept="image/*" onChange={event => selectPhoto(event.target.files?.[0])} /></label>{draft.photoDataUrl && <button className="remove-photo" onClick={() => setDraft(current => ({ ...current, photoDataUrl: '' }))}>Remover foto</button>}<small>JPG, PNG ou WebP · até 2 MB</small></div></div>{photoError && <p className="auth-error">{photoError}</p>}<div className="edit-fields"><label><span>Celular</span><input value={draft.phone} onChange={event => setDraft({ ...draft, phone: event.target.value })} /></label><MedicationPicker name={draft.medicationName} dosageMg={draft.dosageMg} onChange={(medicationName, dosageMg) => setDraft(current => ({ ...current, medicationName, dosageMg }))} /></div><div className="modal-actions"><button className="secondary-btn" onClick={() => setEditing(false)}>Cancelar</button><button className="primary-btn" onClick={saveProfile}>Salvar alterações</button></div></section></div>}
  </div>
}
