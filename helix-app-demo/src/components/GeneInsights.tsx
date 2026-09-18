import { GENE_INSIGHTS } from '../data/medicalKnowledge'

export default function GeneInsights({ genes = [] }: { genes?: string[] }) {
  return <div className="gene-insight-grid">{genes.map(gene => {
    const insight = GENE_INSIGHTS[gene] ?? { title: 'Marcador genômico', description: 'Gene incluído no painel farmacogenômico.', relevance: 'A interpretação deve considerar o contexto clínico completo.' }
    return <article className="gene-insight-card" key={gene}><div><code>{gene}</code><span>{insight.title}</span></div><p>{insight.description}</p><small>{insight.relevance}</small></article>
  })}</div>
}
