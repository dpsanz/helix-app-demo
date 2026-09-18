export const SIGNUP_STEPS = [
  { label: 'Identidade', eyebrow: 'Seus dados' },
  { label: 'Plano', eyebrow: 'Benefício' },
  { label: 'Saúde', eyebrow: 'Seu contexto' },
  { label: 'Genoma', eyebrow: 'Consentimento' },
] as const

export const SIGNUP_PLANS = [
  { id: 'essencial', name: 'Helix Essencial', description: 'Perfil genômico básico · 40 genes', price: 'Incluso no plano' },
  { id: 'completo', name: 'Helix Completo', description: '80 genes farmacogenômicos · laudo preditivo', price: 'R$ 49/mês', badge: 'Recomendado' },
  { id: 'familia', name: 'Helix Família', description: 'Inclui dependentes · genoma familiar', price: 'R$ 19/dep.' },
] as const
