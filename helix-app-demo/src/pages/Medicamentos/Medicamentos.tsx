import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../../components/DashboardSidebar'
import MedicationPicker from '../../components/MedicationPicker'
import { getUser, medicationLabel, updateUser } from '../../data/helixDb'
import type { HelixUser } from '../../data/helixDb'
import { useAuth } from '../../hooks/useAuth'

type MedicationDraft = { name: string; dosageMg: string }

function medicationDraft(user: HelixUser): MedicationDraft {
  return {
    name: user.health?.medicationName ?? '',
    dosageMg: user.health?.dosageMg ?? '',
  }
}

export default function Medicamentos() {
  const [user, setUser] = useState<HelixUser | null>(null)
  const [draft, setDraft] = useState<MedicationDraft>({ name: '', dosageMg: '' })
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const { logout, userId } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) return
    getUser(userId).then(profile => {
      setUser(profile)
      if (profile) setDraft(medicationDraft(profile))
    }).finally(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    if (!showAlert) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [showAlert])

  const leave = () => { logout(); navigate('/') }
  const saveMedication = async () => {
    if (!user || !draft.name || !draft.dosageMg) return
    const medication = `${draft.name} ${draft.dosageMg} mg`
    const updated = await updateUser(user.id, {
      health: {
        conditions: user.health?.conditions ?? [],
        allergies: user.health?.allergies ?? [],
        familyHistory: user.health?.familyHistory ?? [],
        medication,
        medicationName: draft.name,
        dosageMg: draft.dosageMg,
      },
      patientStatus: 'alerta',
    })
    setUser(updated)
    setShowAlert(true)
  }

  if (loading) return <div className="app-loading"><img src="/logo.svg" alt="" /><span>Carregando medicamentos…</span></div>
  if (!user) return <div className="app-loading"><p>Perfil não encontrado neste navegador.</p><button className="primary-btn" onClick={leave}>Voltar ao login</button></div>

  const currentMedication = medicationLabel(user.health) || 'Nenhum medicamento informado'
  const isReadyToSave = Boolean(draft.name && draft.dosageMg)

  return <div className="app-shell page-enter">
    <DashboardSidebar userId={user.id} name={user.name} photoDataUrl={user.photoDataUrl} role="beneficiary" onPrimaryAction={() => navigate('/perfil?edit=1')} onLogout={leave} />
    <main className="dashboard medication-page">
      <button className="back-link" onClick={() => navigate('/perfil')}>‹ Voltar ao perfil</button>
      <section className="medication-page-heading"><div><span className="eyebrow">Tratamento</span><h1>Medicamentos</h1><p>Consulte o medicamento acompanhado e atualize a dose quando necessário.</p></div><span className="status-alert">● Acompanhamento ativo</span></section>

      <section className="medication-workspace">
        <article className="current-medication-panel"><span className="eyebrow">EM ACOMPANHAMENTO</span><div className="current-medication-name"><span className="med-icon">Rx</span><div><strong>{currentMedication}</strong><p>Informação disponível para o profissional vinculado ao seu perfil.</p></div></div><div className="medication-warning"><strong>Importante</strong><p>Qualquer mudança deve ser discutida com o profissional de saúde responsável.</p></div></article>
        <article className="medication-form-panel"><span className="eyebrow">ATUALIZAR TRATAMENTO</span><h2>Adicionar ou alterar medicamento</h2><p className="modal-lead">Escolha o medicamento e informe a dose registrada.</p><MedicationPicker name={draft.name} dosageMg={draft.dosageMg} onChange={(name, dosageMg) => setDraft({ name, dosageMg })} /><button className="primary-btn full" disabled={!isReadyToSave} onClick={saveMedication}>Adicionar ao acompanhamento</button></article>
      </section>
    </main>

    {showAlert && <div className="modal-backdrop" onMouseDown={() => setShowAlert(false)}><section className="modal medication-alert-modal" role="dialog" aria-modal="true" aria-labelledby="medication-alert-title" onMouseDown={event => event.stopPropagation()}><button className="modal-close" onClick={() => setShowAlert(false)} aria-label="Fechar">×</button><span className="status-alert">Atenção farmacogenômica</span><h2 id="medication-alert-title">Acompanhamento recomendado</h2><p className="modal-lead"><strong>{draft.name} {draft.dosageMg} mg</strong> foi adicionado ao seu acompanhamento.</p><div className="recommendation"><strong>Por que a plataforma avisou?</strong><p>O seu perfil contém marcadores genômicos que podem influenciar a resposta a alguns medicamentos. Por isso, este caso deve ser revisado pelo profissional responsável.</p></div><div className="info-block"><small>O que acontece agora</small><p>O alerta ficará disponível no portal médico para que o caso seja acompanhado.</p></div><p className="disclaimer">Este alerta é uma regra local simulada para demonstração. Ele não substitui avaliação clínica, prescrição ou decisão médica.</p><button className="primary-btn full" onClick={() => setShowAlert(false)}>Entendi</button></section></div>}
  </div>
}
