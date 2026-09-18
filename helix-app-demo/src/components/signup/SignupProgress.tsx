import CheckIcon from './CheckIcon'
import { SIGNUP_STEPS } from '../../data/signupOptions'

type Props = { current: number; onSelect: (step: number) => void }

export default function SignupProgress({ current, onSelect }: Props) {
  return <>
    <div className="signup-card-head">
      <div><span>Cadastro em 4 passos</span><strong>{SIGNUP_STEPS[current].eyebrow}</strong></div>
      <span className="step-count">0{current + 1} <i>/ 04</i></span>
    </div>
    <div className="stepper" aria-label="Progresso do cadastro">
      {SIGNUP_STEPS.map((item, index) => <button key={item.label} type="button" disabled={index > current} className={index === current ? 'active' : index < current ? 'done' : ''} onClick={() => onSelect(index)}>
        <span className="step-dot">{index < current ? <CheckIcon /> : index + 1}</span>
        <small>{item.label}</small>
      </button>)}
      <div className="step-line"><i style={{ width: `${(current / (SIGNUP_STEPS.length - 1)) * 100}%` }} /></div>
    </div>
  </>
}
