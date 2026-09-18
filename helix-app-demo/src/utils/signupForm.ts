export type SignupFormData = {
  name: string
  cpf: string
  birth: string
  phone: string
  email: string
  password: string
  cardNumber: string
  medicationName: string
  dosageMg: string
}

export type HealthSelections = Record<'conditions' | 'allergies' | 'family', string[]>

export const EMPTY_SIGNUP_FORM: SignupFormData = {
  name: '', cpf: '', birth: '', phone: '', email: '', password: '', cardNumber: '', medicationName: '', dosageMg: '',
}

const digits = (value: string) => value.replace(/\D/g, '')

export function formatCpf(value: string) {
  return digits(value).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function formatPhone(value: string) {
  const clean = digits(value).slice(0, 11)
  return clean.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2')
}

export function formatCardNumber(value: string) {
  return digits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatSignupField(field: keyof SignupFormData, value: string) {
  if (field === 'cpf') return formatCpf(value)
  if (field === 'phone') return formatPhone(value)
  if (field === 'cardNumber') return formatCardNumber(value)
  return value
}

export function validateIdentity(form: SignupFormData) {
  if (!form.name.trim() || !form.cpf || !form.email.trim() || !form.password) return 'Preencha nome, CPF, e-mail e senha.'
  if (digits(form.cpf).length !== 11) return 'Informe um CPF com 11 dígitos.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Informe um e-mail válido.'
  if (form.password.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.'
  return null
}

export function toggleHealthChoice(current: string[], item: string) {
  const exclusive = item === 'Nenhuma' || item === 'Não sei'
  if (current.includes(item)) return current.filter(value => value !== item)
  if (exclusive) return [item]
  return [...current.filter(value => value !== 'Nenhuma' && value !== 'Não sei'), item]
}
