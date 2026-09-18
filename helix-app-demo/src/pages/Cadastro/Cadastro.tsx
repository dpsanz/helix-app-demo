import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { createBeneficiary } from '../../data/helixDb'

const steps = [
  { label: 'Identidade', eyebrow: 'Seus dados' },
  { label: 'Plano', eyebrow: 'Benefício' },
  { label: 'Saúde', eyebrow: 'Seu contexto' },
  { label: 'Genoma', eyebrow: 'Consentimento' },
]

const plans = [
  { id: 'essencial', name: 'Helix Essencial', description: 'Perfil genômico básico · 40 genes', price: 'Incluso no plano' },
  { id: 'completo', name: 'Helix Completo', description: '80 genes farmacogenômicos · laudo preditivo', price: 'R$ 49/mês', badge: 'Recomendado' },
  { id: 'familia', name: 'Helix Família', description: 'Inclui dependentes · genoma familiar', price: 'R$ 19/dep.' },
]

const conditions = ['Hipertensão', 'Diabetes', 'Colesterol alto', 'Depressão', 'Asma', 'Tireoide', 'Nenhuma']
const allergies = ['Penicilina', 'Dipirona', 'Ibuprofeno', 'AAS', 'Nenhuma']
const familyHistory = ['Cardiopatia', 'Câncer', 'Diabetes tipo 2', 'Não sei']

type Field = { label: string; name: string; type?: string; placeholder: string; wide?: boolean }

const identityFields: Field[] = [
  { label: 'Nome completo', name: 'name', placeholder: 'Como consta no documento', wide: true },
  { label: 'CPF', name: 'cpf', placeholder: '000.000.000-00' },
  { label: 'Data de nascimento', name: 'birth', type: 'date', placeholder: '' },
  { label: 'Celular', name: 'phone', placeholder: '(00) 00000-0000' },
  { label: 'E-mail', name: 'email', type: 'email', placeholder: 'voce@email.com' },
  { label: 'Crie uma senha', name: 'password', type: 'password', placeholder: 'Mínimo de 6 caracteres', wide: true },
]

function CheckIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10.2 3.1 3.1L15.5 6" /></svg>
}

function ArrowIcon({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className={back ? 'back' : ''}><path d="M4 10h12M11 5l5 5-5 5" /></svg>
}

export default function Cadastro() {
  const [step, setStep] = useState(0)
  const [plan, setPlan] = useState('completo')
  const [selected, setSelected] = useState<Record<string, string[]>>({ conditions: ['Hipertensão', 'Colesterol alto'], allergies: ['Nenhuma'], family: ['Cardiopatia'] })
  const [accepted, setAccepted] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const toggle = (group: string, item: string) => {
    setSelected(current => {
      const groupItems = current[group] ?? []
      const exclusive = item === 'Nenhuma' || item === 'Não sei'
      const next = groupItems.includes(item)
        ? groupItems.filter(value => value !== item)
        : exclusive
          ? [item]
          : [...groupItems.filter(value => value !== 'Nenhuma' && value !== 'Não sei'), item]
      return { ...current, [group]: next }
    })
  }

  const next = async () => {
    setError('')
    if (step === 0 && (!form.name || !form.cpf || !form.email || !form.password || form.password.length < 6)) {
      setError('Preencha nome, CPF, e-mail e uma senha de pelo menos 6 caracteres.')
      return
    }
    if (step < steps.length - 1) { setStep(value => value + 1); return }
    if (!accepted) return
    setSaving(true)
    try {
      const selectedPlan = plans.find(item => item.id === plan)?.name ?? 'Helix Completo'
      const user = await createBeneficiary({
        name: form.name,
        cpf: form.cpf,
        email: form.email,
        password: form.password,
        phone: form.phone,
        birth: form.birth,
        cardNumber: form.cardNumber || 'Aguardando validação',
        plan: selectedPlan,
        health: { conditions: selected.conditions ?? [], allergies: selected.allergies ?? [], familyHistory: selected.family ?? [], medication: form.medication ?? '' },
      })
      login(user.id, 'beneficiary')
      navigate('/perfil')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível criar a conta.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="signup-page page-enter">
      <div className="signup-orb signup-orb-one" />
      <div className="signup-orb signup-orb-two" />

      <header className="signup-nav">
        <Link to="/" className="signup-brand" aria-label="Helix — início">
          <img src="/logo.svg" alt="" />
          <div><strong>HELIX</strong></div>
        </Link>
        <Link to="/" className="signup-login">Já tenho uma conta <span>Entrar</span></Link>
      </header>

      <section className="signup-wrap">
        <div className="signup-intro">
          <span className="signup-kicker">02 — CRIAÇÃO DE CONTA · BENEFICIÁRIO</span>
          <h1>Seu cuidado começa<br /><em>com você.</em></h1>
          <p>Crie seu perfil e transforme suas informações em um cuidado mais preciso, seguro e pessoal.</p>
          <div className="signup-trust">
            <span className="trust-icon">⌁</span>
            <div><strong>Seus dados protegidos</strong><small>Criptografia de ponta a ponta e total conformidade com a LGPD.</small></div>
          </div>
        </div>

        <div className="signup-card ui-card">
          <div className="signup-card-head">
            <div><span>Cadastro em 4 passos</span><strong>{steps[step].eyebrow}</strong></div>
            <span className="step-count">0{step + 1} <i>/ 04</i></span>
          </div>

          <div className="stepper" aria-label="Progresso do cadastro">
            {steps.map((item, index) => (
              <button key={item.label} type="button" className={index === step ? 'active' : index < step ? 'done' : ''} onClick={() => index <= step && setStep(index)}>
                <span className="step-dot">{index < step ? <CheckIcon /> : index + 1}</span>
                <small>{item.label}</small>
              </button>
            ))}
            <div className="step-line"><i style={{ width: `${(step / (steps.length - 1)) * 100}%` }} /></div>
          </div>

          <div className="signup-content" key={step}>
            {step === 0 && <>
              <div className="content-heading"><span>01 · IDENTIDADE</span><h2>Vamos começar</h2><p>Conte o básico para criarmos o seu perfil Helix.</p></div>
              <div className="signup-fields">
                {identityFields.map(field => <label key={field.name} className={field.wide ? 'field-wide' : ''}>
                  <span>{field.label}</span>
                  <input type={field.type ?? 'text'} placeholder={field.placeholder} value={form[field.name] ?? ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })} />
                </label>)}
              </div>
            </>}

            {step === 1 && <>
              <div className="content-heading"><span>02 · PLANO</span><h2>Seu plano Unimed</h2><p>Identificamos os benefícios disponíveis para você.</p></div>
              <label className="plan-card-field"><span>Número da carteirinha</span><input value={form.cardNumber ?? ''} onChange={e => setForm({ ...form, cardNumber: e.target.value })} placeholder="Ex.: 0083 4417 8820 0001" /></label>
              <div className="plan-id"><span>Plano identificado</span><div><strong>Unimed Empresarial Ouro</strong><small>Beneficiário titular</small></div><i><CheckIcon /></i></div>
              <div className="plan-list">
                {plans.map(item => <button type="button" key={item.id} onClick={() => setPlan(item.id)} className={`plan-option ${plan === item.id ? 'selected' : ''}`}>
                  <span className="radio"><i /></span><span className="plan-copy"><strong>{item.name}{item.badge && <em>{item.badge}</em>}</strong><small>{item.description}</small></span><b>{item.price}</b>
                </button>)}
              </div>
            </>}

            {step === 2 && <>
              <div className="content-heading"><span>03 · SAÚDE</span><h2>Contexto de saúde</h2><p>Para personalizar seu perfil genômico inicial.</p></div>
              <ChipGroup label="Condições crônicas conhecidas" items={conditions} selected={selected.conditions} onToggle={item => toggle('conditions', item)} />
              <label className="medication-field"><span>Medicamentos em uso contínuo</span><input value={form.medication ?? ''} onChange={e => setForm({ ...form, medication: e.target.value })} placeholder="Ex.: Losartana 50 mg" /></label>
              <ChipGroup label="Alergias a medicamentos" items={allergies} selected={selected.allergies} onToggle={item => toggle('allergies', item)} />
              <ChipGroup label="Histórico familiar relevante" items={familyHistory} selected={selected.family} onToggle={item => toggle('family', item)} />
            </>}

            {step === 3 && <>
              <div className="content-heading"><span>04 · GENOMA</span><h2>Você no controle</h2><p>Seu DNA é único. A decisão sobre como usá-lo também é sua.</p></div>
              <div className="consent-card"><div className="dna-mark">⌬</div><div><strong>Consentimento genômico</strong><p>Autorizo a análise da minha amostra exclusivamente para gerar meu perfil de saúde e recomendações personalizadas.</p></div></div>
              <ul className="privacy-list"><li><CheckIcon />Você pode revogar este consentimento quando quiser</li><li><CheckIcon />Seus dados não serão vendidos ou compartilhados sem autorização</li><li><CheckIcon />Resultados protegidos por sigilo médico e LGPD</li></ul>
              <label className="consent-check"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} /><span><i><CheckIcon /></i>Li e concordo com o <a href="#termo">Termo de Consentimento Genômico</a> e a <a href="#privacidade">Política de Privacidade</a>.</span></label>
            </>}
          </div>

          {error && <p className="signup-error" role="alert">{error}</p>}
          <div className="signup-actions">
            {step > 0 ? <button type="button" className="back-button" onClick={() => setStep(value => value - 1)}><ArrowIcon back />Voltar</button> : <span />}
            <button type="button" className="continue-button" onClick={next} disabled={(step === 3 && !accepted) || saving}>{saving ? 'Criando…' : step === 3 ? 'Criar minha conta' : 'Continuar'}<ArrowIcon /></button>
          </div>
          {step === 2 && <button type="button" className="skip-button" onClick={next}>Prefiro preencher depois</button>}
        </div>
      </section>

      <footer className="signup-footer"><span>© 2026 Helix Saúde</span><span>Privacidade · Termos · Segurança</span></footer>
    </main>
  )
}

function ChipGroup({ label, items, selected = [], onToggle }: { label: string; items: string[]; selected?: string[]; onToggle: (item: string) => void }) {
  return <div className="chip-group"><span>{label}</span><div>{items.map(item => <button type="button" key={item} className={selected.includes(item) ? 'selected' : ''} onClick={() => onToggle(item)}>{selected.includes(item) && <CheckIcon />}{item}</button>)}</div></div>
}
