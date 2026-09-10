export type PatientStatus = 'alerta' | 'ok'

export type Patient = {
  id: string
  name: string
  initials: string
  appointmentTime: string
  medication: string
  status: PatientStatus
  genes: string[]
  alertSummary?: string
}

export const beneficiary = {
  id: 'HLX-00441',
  name: 'Ana Carolina Ferreira',
  initials: 'AC',
  cardNumber: '0064 8821 4401 3',
  plan: 'Unimed Nacional — Enfermaria',
  genomicStatus: 'Perfil genômico ativo',
  genes: ['CYP2C9', 'VKORC1', 'CYP2C19'],
  kit: {
    name: 'Kit salivar Helix',
    collectedAt: '12 de agosto de 2026',
    processedAt: '19 de agosto de 2026',
    status: 'Análise concluída',
  },
  history: [
    {
      date: 'Hoje, 09:42',
      title: 'Compatibilidade consultada',
      description: 'Varfarina 5 mg',
    },
    {
      date: '19 ago. 2026',
      title: 'Perfil genômico disponibilizado',
      description: 'Painel farmacogenômico concluído',
    },
    {
      date: '12 ago. 2026',
      title: 'Amostra recebida',
      description: 'Kit salivar Helix',
    },
  ],
  medication: {
    name: 'Varfarina 5 mg',
    status: 'Atenção',
    genes: ['CYP2C9', 'VKORC1'],
    attentionLevel: 'Atenção elevada',
    explanation:
      'Variantes identificadas podem alterar a sensibilidade à varfarina e exigir acompanhamento mais próximo da resposta ao tratamento.',
    recommendation:
      'Converse com seu médico antes de iniciar, interromper ou alterar a dose deste medicamento.',
  },
} as const

export const doctor = {
  name: 'Dr. Carlos Almeida',
  initials: 'CA',
  crm: 'CRM-SP 85442',
  specialty: 'Cardiologia',
  status: 'Médico cooperado validado',
} as const

export const patients: Patient[] = [
  {
    id: beneficiary.id,
    name: beneficiary.name,
    initials: beneficiary.initials,
    appointmentTime: '09:30',
    medication: beneficiary.medication.name,
    status: 'alerta',
    genes: [...beneficiary.medication.genes],
    alertSummary:
      'O perfil farmacogenômico indica possível sensibilidade aumentada à varfarina. Considere revisar a dose e o acompanhamento clínico.',
  },
  {
    id: 'HLX-00817',
    name: 'João M. Santos',
    initials: 'JS',
    appointmentTime: '10:15',
    medication: 'Clopidogrel 75 mg',
    status: 'alerta',
    genes: ['CYP2C19'],
    alertSummary:
      'Há uma observação farmacogenômica simulada relacionada à resposta ao clopidogrel.',
  },
  {
    id: 'HLX-00293',
    name: 'Maria P. Lima',
    initials: 'ML',
    appointmentTime: '11:00',
    medication: 'Metformina 500 mg',
    status: 'ok',
    genes: [],
  },
  {
    id: 'HLX-00652',
    name: 'Carlos R. Silva',
    initials: 'CS',
    appointmentTime: '14:20',
    medication: 'Sinvastatina 40 mg',
    status: 'ok',
    genes: [],
  },
]

export const demoDisclaimer =
  'Dados fictícios para demonstração. Este conteúdo não substitui avaliação ou orientação profissional.'
