import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteAllBeneficiaries, deleteUser, initials, listAllUsers } from '../../data/helixDb'
import type { HelixUser, UserRole } from '../../data/helixDb'

type Filter = 'all' | UserRole
type DeleteTarget = { kind: 'user'; user: HelixUser } | { kind: 'all'; count: number }

export default function Gerenciamento() {
  const [users, setUsers] = useState<HelixUser[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [notice, setNotice] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try { setUsers(await listAllUsers()) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    let active = true
    listAllUsers().then(data => {
      if (!active) return
      setUsers(data); setLoading(false)
    })
    return () => { active = false }
  }, [])

  const beneficiaries = users.filter(user => user.role === 'beneficiary')
  const doctors = users.filter(user => user.role === 'doctor')
  const alerts = beneficiaries.filter(user => user.patientStatus === 'alerta').length
  const visibleUsers = useMemo(() => {
    const term = query.trim().toLowerCase()
    return users.filter(user => (filter === 'all' || user.role === filter) && (!term || `${user.name} ${user.email} ${user.cpf} ${user.id}`.toLowerCase().includes(term)))
  }, [users, filter, query])

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true); setNotice('')
    try {
      if (deleteTarget.kind === 'user') {
        await deleteUser(deleteTarget.user.id)
        setNotice(`${deleteTarget.user.name} foi removido do banco local.`)
      } else {
        const count = await deleteAllBeneficiaries()
        setNotice(`${count} cadastro${count === 1 ? '' : 's'} de beneficiário removido${count === 1 ? '' : 's'}.`)
      }
      setDeleteTarget(null)
      await loadUsers()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Não foi possível excluir os dados.')
    } finally { setDeleting(false) }
  }

  return <main className="management-page page-enter">
    <header className="management-nav">
      <Link to="/" className="signup-brand"><img src="/logo.svg" alt="" /><div><strong>HELIX</strong></div></Link>
      <div className="management-nav-copy"><span>Console local</span><strong>Gerenciamento de dados</strong></div>
      <Link to="/" className="management-exit">Voltar ao início</Link>
    </header>

    <div className="management-shell">
      <section className="management-heading">
        <div><span className="management-kicker">INDEXEDDB · VISÃO GERAL</span><h1>Cadastros armazenados</h1><p>Consulte e remova os perfis salvos localmente neste navegador.</p></div>
        <button className="danger-outline" disabled={!beneficiaries.length} onClick={() => setDeleteTarget({ kind: 'all', count: beneficiaries.length })}>Limpar beneficiários</button>
      </section>

      <section className="management-metrics">
        <Metric label="Total de cadastros" value={users.length} detail="Registros locais" />
        <Metric label="Beneficiários" value={beneficiaries.length} detail="Perfis vinculados" />
        <Metric label="Profissionais" value={doctors.length} detail="Contas médicas" />
        <Metric label="Com atenção" value={alerts} detail="Alertas ativos" alert={alerts > 0} />
      </section>

      <section className="management-panel">
        <div className="management-toolbar">
          <label className="management-search"><span>Buscar cadastro</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Nome, e-mail, CPF ou ID" /></label>
          <div className="management-filters">{([['all', 'Todos'], ['beneficiary', 'Beneficiários'], ['doctor', 'Médicos']] as const).map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div>
        </div>

        {notice && <div className="management-notice">{notice}<button onClick={() => setNotice('')} aria-label="Fechar aviso">×</button></div>}
        {loading ? <div className="management-empty">Carregando banco local…</div> : visibleUsers.length === 0 ? <div className="management-empty"><strong>Nenhum cadastro encontrado</strong><span>Ajuste a busca ou crie uma nova conta.</span></div> : <div className="management-table-wrap"><table className="management-table">
          <thead><tr><th>Cadastro</th><th>Tipo</th><th>Identificação</th><th>Plano / vínculo</th><th>Criado em</th><th><span className="sr-only">Ações</span></th></tr></thead>
          <tbody>{visibleUsers.map(user => <UserRow key={user.id} user={user} onDelete={() => setDeleteTarget({ kind: 'user', user })} />)}</tbody>
        </table></div>}
      </section>
    </div>

    {deleteTarget && <div className="modal-backdrop" onMouseDown={() => !deleting && setDeleteTarget(null)}><section className="delete-dialog modal-enter" role="alertdialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}>
      <span className="delete-dialog-label">Ação destrutiva</span>
      <h2>{deleteTarget.kind === 'user' ? 'Excluir este cadastro?' : 'Limpar beneficiários?'}</h2>
      <p>{deleteTarget.kind === 'user' ? <>O perfil de <strong>{deleteTarget.user.name}</strong> e seus dados locais serão removidos permanentemente.</> : <>Os <strong>{deleteTarget.count} perfis de beneficiários</strong> serão removidos. A conta médica do sistema será preservada.</>}</p>
      <div className="delete-dialog-actions"><button className="secondary-btn" disabled={deleting} onClick={() => setDeleteTarget(null)}>Cancelar</button><button className="danger-button" disabled={deleting} onClick={confirmDelete}>{deleting ? 'Excluindo…' : 'Excluir definitivamente'}</button></div>
    </section></div>}
  </main>
}

function Metric({ label, value, detail, alert = false }: { label: string; value: number; detail: string; alert?: boolean }) {
  return <article className={`management-metric ${alert ? 'alert' : ''}`}><span>{label}</span><strong>{String(value).padStart(2, '0')}</strong><small>{detail}</small></article>
}

function UserRow({ user, onDelete }: { user: HelixUser; onDelete: () => void }) {
  const systemAccount = user.role === 'doctor'
  return <tr>
    <td><div className="management-user"><span className="avatar small">{initials(user.name)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div></td>
    <td><span className={`role-badge ${user.role}`}>{user.role === 'doctor' ? 'Médico' : 'Beneficiário'}</span></td>
    <td><strong className="management-code">{user.id}</strong><small>{formatCpf(user.cpf)}</small></td>
    <td><strong>{user.plan || 'Conta de sistema'}</strong><small>{user.cardNumber || 'Acesso profissional'}</small></td>
    <td><strong>{new Intl.DateTimeFormat('pt-BR').format(new Date(user.createdAt))}</strong><small>{new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(user.createdAt))}</small></td>
    <td>{systemAccount ? <span className="system-lock">Sistema</span> : <button className="row-delete" onClick={onDelete}>Excluir</button>}</td>
  </tr>
}

function formatCpf(value: string) {
  const clean = value.replace(/\D/g, '')
  if (clean.length !== 11) return value || 'CPF não informado'
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
