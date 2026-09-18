import type { Dispatch, SetStateAction } from 'react'
import type { HealthSelections, SignupFormData } from '../../utils/signupForm'
import { formatSignupField } from '../../utils/signupForm'
import { SIGNUP_PLANS } from '../../data/signupOptions'
import CheckIcon from './CheckIcon'

const conditions = ['Hipertensão', 'Diabetes', 'Colesterol alto', 'Depressão', 'Asma', 'Tireoide', 'Nenhuma']
const allergies = ['Penicilina', 'Dipirona', 'Ibuprofeno', 'AAS', 'Nenhuma']
const familyHistory = ['Cardiopatia', 'Câncer', 'Diabetes tipo 2', 'Não sei']

type Props = {
  step: number
  form: SignupFormData
  setForm: Dispatch<SetStateAction<SignupFormData>>
  plan: string
  setPlan: (plan: string) => void
  selected: HealthSelections
  onToggle: (group: keyof HealthSelections, item: string) => void
  accepted: boolean
  setAccepted: (accepted: boolean) => void
}

const identityFields: Array<{ label: string; name: keyof SignupFormData; type?: string; placeholder: string; wide?: boolean }> = [
  { label: 'Nome completo', name: 'name', placeholder: 'Como consta no documento', wide: true },
  { label: 'CPF', name: 'cpf', placeholder: '000.000.000-00' },
  { label: 'Data de nascimento', name: 'birth', type: 'date', placeholder: '' },
  { label: 'Celular', name: 'phone', placeholder: '(00) 00000-0000' },
  { label: 'E-mail', name: 'email', type: 'email', placeholder: 'voce@email.com' },
  { label: 'Crie uma senha', name: 'password', type: 'password', placeholder: 'Mínimo de 6 caracteres', wide: true },
]

export default function SignupStepContent(props: Props) {
  return <div className="signup-content" key={props.step}>
    {props.step === 0 && <IdentityStep form={props.form} setForm={props.setForm} />}
    {props.step === 1 && <PlanStep form={props.form} setForm={props.setForm} plan={props.plan} setPlan={props.setPlan} />}
    {props.step === 2 && <HealthStep form={props.form} setForm={props.setForm} selected={props.selected} onToggle={props.onToggle} />}
    {props.step === 3 && <GenomeStep accepted={props.accepted} setAccepted={props.setAccepted} />}
  </div>
}

function IdentityStep({ form, setForm }: Pick<Props, 'form' | 'setForm'>) {
  const update = (field: keyof SignupFormData, value: string) => setForm(current => ({ ...current, [field]: formatSignupField(field, value) }))
  return <>
    <Heading code="01 · IDENTIDADE" title="Vamos começar" description="Conte o básico para criarmos o seu perfil Helix." />
    <div className="signup-fields">{identityFields.map(field => <label key={field.name} className={field.wide ? 'field-wide' : ''}>
      <span>{field.label}</span><input type={field.type ?? 'text'} placeholder={field.placeholder} value={form[field.name]} onChange={event => update(field.name, event.target.value)} />
    </label>)}</div>
  </>
}

function PlanStep({ form, setForm, plan, setPlan }: Pick<Props, 'form' | 'setForm' | 'plan' | 'setPlan'>) {
  return <>
    <Heading code="02 · PLANO" title="Seu plano Unimed" description="Identificamos os benefícios disponíveis para você." />
    <label className="plan-card-field"><span>Número da carteirinha</span><input value={form.cardNumber} onChange={event => setForm(current => ({ ...current, cardNumber: formatSignupField('cardNumber', event.target.value) }))} placeholder="Ex.: 0083 4417 8820 0001" /></label>
    <div className="plan-id"><span>Plano identificado</span><div><strong>Unimed Empresarial Ouro</strong><small>Beneficiário titular</small></div><i><CheckIcon /></i></div>
    <div className="plan-list">{SIGNUP_PLANS.map(item => <button type="button" key={item.id} onClick={() => setPlan(item.id)} className={`plan-option ${plan === item.id ? 'selected' : ''}`}>
      <span className="radio"><i /></span><span className="plan-copy"><strong>{item.name}{'badge' in item && <em>{item.badge}</em>}</strong><small>{item.description}</small></span><b>{item.price}</b>
    </button>)}</div>
  </>
}

function HealthStep({ form, setForm, selected, onToggle }: Pick<Props, 'form' | 'setForm' | 'selected' | 'onToggle'>) {
  return <>
    <Heading code="03 · SAÚDE" title="Contexto de saúde" description="Para personalizar seu perfil genômico inicial." />
    <ChipGroup label="Condições crônicas conhecidas" items={conditions} selected={selected.conditions} onToggle={item => onToggle('conditions', item)} />
    <label className="medication-field"><span>Medicamentos em uso contínuo</span><input value={form.medication} onChange={event => setForm(current => ({ ...current, medication: event.target.value }))} placeholder="Ex.: Losartana 50 mg" /></label>
    <ChipGroup label="Alergias a medicamentos" items={allergies} selected={selected.allergies} onToggle={item => onToggle('allergies', item)} />
    <ChipGroup label="Histórico familiar relevante" items={familyHistory} selected={selected.family} onToggle={item => onToggle('family', item)} />
  </>
}

function GenomeStep({ accepted, setAccepted }: Pick<Props, 'accepted' | 'setAccepted'>) {
  return <>
    <Heading code="04 · GENOMA" title="Você no controle" description="Seu DNA é único. A decisão sobre como usá-lo também é sua." />
    <div className="consent-card"><div className="dna-mark">⌬</div><div><strong>Consentimento genômico</strong><p>Autorizo a análise da minha amostra exclusivamente para gerar meu perfil de saúde e recomendações personalizadas.</p></div></div>
    <ul className="privacy-list"><li><CheckIcon />Você pode revogar este consentimento quando quiser</li><li><CheckIcon />Seus dados não serão vendidos ou compartilhados sem autorização</li><li><CheckIcon />Resultados protegidos por sigilo médico e LGPD</li></ul>
    <label className="consent-check"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} /><span><i><CheckIcon /></i>Li e concordo com o <a href="#termo">Termo de Consentimento Genômico</a> e a <a href="#privacidade">Política de Privacidade</a>.</span></label>
  </>
}

function Heading({ code, title, description }: { code: string; title: string; description: string }) {
  return <div className="content-heading"><span>{code}</span><h2>{title}</h2><p>{description}</p></div>
}

function ChipGroup({ label, items, selected, onToggle }: { label: string; items: string[]; selected: string[]; onToggle: (item: string) => void }) {
  return <div className="chip-group"><span>{label}</span><div>{items.map(item => <button type="button" key={item} className={selected.includes(item) ? 'selected' : ''} onClick={() => onToggle(item)}>{selected.includes(item) && <CheckIcon />}{item}</button>)}</div></div>
}
