export const MEDICATIONS = [
  { name: 'Metformina', dosages: ['500', '750', '850', '1000'], category: 'Diabetes' },
  { name: 'Gliclazida', dosages: ['30', '60', '80'], category: 'Diabetes' },
  { name: 'Empagliflozina', dosages: ['10', '25'], category: 'Diabetes' },
  { name: 'Insulina glargina', dosages: ['100'], category: 'Diabetes' },
  { name: 'Losartana', dosages: ['25', '50', '100'], category: 'Hipertensão' },
  { name: 'Enalapril', dosages: ['5', '10', '20'], category: 'Hipertensão' },
  { name: 'Amlodipino', dosages: ['2.5', '5', '10'], category: 'Hipertensão' },
  { name: 'Sinvastatina', dosages: ['10', '20', '40'], category: 'Colesterol' },
  { name: 'Atorvastatina', dosages: ['10', '20', '40', '80'], category: 'Colesterol' },
  { name: 'Sertralina', dosages: ['25', '50', '100'], category: 'Saúde mental' },
  { name: 'Fluoxetina', dosages: ['10', '20', '40'], category: 'Saúde mental' },
  { name: 'Levotiroxina', dosages: ['25', '50', '75', '100'], category: 'Tireoide' },
  { name: 'Varfarina', dosages: ['2.5', '5', '7.5'], category: 'Anticoagulante' },
  { name: 'Clopidogrel', dosages: ['75'], category: 'Antiplaquetário' },
] as const

export const GENE_INSIGHTS: Record<string, { title: string; description: string; relevance: string }> = {
  TCF7L2: { title: 'Regulação da glicose', description: 'Associado à produção e à ação da insulina no organismo.', relevance: 'Pode contribuir para maior predisposição ao diabetes tipo 2.' },
  SLC30A8: { title: 'Secreção de insulina', description: 'Participa do transporte de zinco nas células beta pancreáticas.', relevance: 'Ajuda a contextualizar o funcionamento metabólico e o controle glicêmico.' },
  CYP2C9: { title: 'Metabolização hepática', description: 'Atua no processamento de diversos medicamentos pelo fígado.', relevance: 'Pode influenciar dose e acompanhamento de alguns fármacos.' },
  VKORC1: { title: 'Coagulação sanguínea', description: 'Participa do ciclo da vitamina K e da resposta anticoagulante.', relevance: 'Relevante para avaliação de sensibilidade à varfarina.' },
  CYP2C19: { title: 'Resposta medicamentosa', description: 'Metaboliza medicamentos como clopidogrel e alguns antidepressivos.', relevance: 'Variantes podem alterar velocidade de metabolização e resposta.' },
}

export const ANDRE_GLUCOSE = [
  { label: 'Seg', value: 118 }, { label: 'Ter', value: 126 }, { label: 'Qua', value: 112 },
  { label: 'Qui', value: 121 }, { label: 'Sex', value: 108 }, { label: 'Sáb', value: 115 }, { label: 'Dom', value: 104 },
]

export const ANDRE_WEIGHT = [
  { label: 'Mai', value: 91.2 }, { label: 'Jun', value: 89.8 }, { label: 'Jul', value: 88.9 },
  { label: 'Ago', value: 87.6 }, { label: 'Set', value: 86.8 },
]
