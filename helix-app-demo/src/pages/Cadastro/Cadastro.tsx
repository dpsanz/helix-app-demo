import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteFooter from '../../components/SiteFooter'
import SignupHeader from '../../components/signup/SignupHeader'
import SignupIntro from '../../components/signup/SignupIntro'
import SignupNavigation from '../../components/signup/SignupNavigation'
import SignupProgress from '../../components/signup/SignupProgress'
import SignupStepContent from '../../components/signup/SignupStepContent'
import { createBeneficiary } from '../../data/helixDb'
import { SIGNUP_PLANS, SIGNUP_STEPS } from '../../data/signupOptions'
import { useAuth } from '../../hooks/useAuth'
import { EMPTY_SIGNUP_FORM, toggleHealthChoice, validateIdentity } from '../../utils/signupForm'
import type { HealthSelections } from '../../utils/signupForm'

const INITIAL_HEALTH: HealthSelections = {
  conditions: ['Hipertensão', 'Colesterol alto'],
  allergies: ['Nenhuma'],
  family: ['Cardiopatia'],
}

export default function Cadastro() {
  const [step, setStep] = useState(0)
  const [plan, setPlan] = useState('completo')
  const [selected, setSelected] = useState<HealthSelections>(INITIAL_HEALTH)
  const [accepted, setAccepted] = useState(false)
  const [form, setForm] = useState(EMPTY_SIGNUP_FORM)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const toggle = (group: keyof HealthSelections, item: string) => {
    setSelected(current => ({ ...current, [group]: toggleHealthChoice(current[group], item) }))
  }

  const goBack = () => {
    setError('')
    setStep(current => Math.max(0, current - 1))
  }

  const goNext = async () => {
    setError('')
    if (step === 0) {
      const validationError = validateIdentity(form)
      if (validationError) { setError(validationError); return }
    }
    if (step < SIGNUP_STEPS.length - 1) { setStep(current => current + 1); return }
    if (!accepted) return

    setSaving(true)
    try {
      const selectedPlan = SIGNUP_PLANS.find(item => item.id === plan)?.name ?? 'Helix Completo'
      const user = await createBeneficiary({
        name: form.name.trim(), cpf: form.cpf, email: form.email.trim(), password: form.password,
        phone: form.phone, birth: form.birth, cardNumber: form.cardNumber || 'Aguardando validação', plan: selectedPlan,
        health: { conditions: selected.conditions, allergies: selected.allergies, familyHistory: selected.family, medication: `${form.medicationName}${form.dosageMg ? ` ${form.dosageMg} mg` : ''}`.trim(), medicationName: form.medicationName, dosageMg: form.dosageMg },
      })
      login(user.id, 'beneficiary')
      navigate('/perfil')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível criar a conta.')
    } finally {
      setSaving(false)
    }
  }

  return <main className="signup-page page-enter">
    <div className="signup-orb signup-orb-one" />
    <div className="signup-orb signup-orb-two" />
    <SignupHeader />
    <section className="signup-wrap">
      <SignupIntro />
      <div className="signup-card ui-card">
        <SignupProgress current={step} onSelect={setStep} />
        <SignupStepContent step={step} form={form} setForm={setForm} plan={plan} setPlan={setPlan} selected={selected} onToggle={toggle} accepted={accepted} setAccepted={setAccepted} />
        {error && <p className="signup-error" role="alert">{error}</p>}
        <SignupNavigation step={step} accepted={accepted} saving={saving} onBack={goBack} onNext={goNext} />
      </div>
    </section>
    <SiteFooter />
  </main>
}
