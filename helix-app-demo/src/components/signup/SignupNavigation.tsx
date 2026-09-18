type Props = {
  step: number
  accepted: boolean
  saving: boolean
  onBack: () => void
  onNext: () => void
}

export default function SignupNavigation({ step, accepted, saving, onBack, onNext }: Props) {
  const finalStep = step === 3
  return <>
    <div className="signup-actions">
      {step > 0 ? <button type="button" className="back-button" onClick={onBack}>Voltar</button> : <span />}
      <button type="button" className="continue-button" onClick={onNext} disabled={(finalStep && !accepted) || saving}>
        {saving ? 'Criando…' : finalStep ? 'Criar minha conta' : 'Continuar'}
      </button>
    </div>
    {step === 2 && <button type="button" className="skip-button" onClick={onNext}>Prefiro preencher depois</button>}
  </>
}
