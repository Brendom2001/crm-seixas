import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUSES = ['Novo', 'Contato feito', 'Proposta enviada', 'Negociando', 'Fechado', 'Perdido']
const TIPOS = ['Clínica Dental', 'Clínica Estética', 'Outro']

const STATUS_STYLE = {
  'Novo':              { bg: '#6366f115', color: '#818cf8' },
  'Contato feito':     { bg: '#3b82f615', color: '#60a5fa' },
  'Proposta enviada':  { bg: '#f59e0b15', color: '#fbbf24' },
  'Negociando':        { bg: '#f9731615', color: '#fb923c' },
  'Fechado':           { bg: '#22c55e15', color: '#4ade80' },
  'Perdido':           { bg: '#ef444415', color: '#f87171' },
}

function formatBRL(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value)
}

export default function LeadTable({
  leads, onEdit, onDelete,
  filterStatus, setFilterStatus,
  filterTipo, setFilterTipo,
}) {
  const [sortCol, setSortCol] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')

  function toggleSort(col) {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    let rows = [...leads]
    if (filterStatus) rows = rows.filter(l => l.status === filterStatus)
    if (filterTipo)   rows = rows.filter(l => l.tipo_negocio === filterTipo)

    rows.sort((a, b) => {
      let va = a[sortCol] ?? ''
      let vb = b[sortCol] ?? ''
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return rows
  }, [leads, filterStatus, filterTipo, sortCol, sortDir])

  const selectClass = 'bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2 text-sm text-[#888] focus:outline-none focus:border-[#f97316] transition-colors'
  const thBase = 'px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-[#333] cursor-pointer hover:text-[#666] transition-colors select-none whitespace-nowrap'
  const tdBase = 'px-4 py-3 text-sm text-[#888] whitespace-nowrap'

  function SortArrow({ col }) {
    if (sortCol !== col) return <span className="ml-1 text-[#252525]">↕</span>
    return <span className="ml-1 text-[#f97316]">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selectClass}>
          <option value="">Todos os status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className={selectClass}>
          <option value="">Todos os tipos</option>
          {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {(filterStatus || filterTipo) && (
          <button
            onClick={() => { setFilterStatus(''); setFilterTipo('') }}
            className="text-[#f97316] text-sm hover:text-[#ea6c0a] transition-colors font-mono text-xs"
          >
            × limpar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#0e0e0e] border border-[#181818] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#181818]">
                <th className={thBase} onClick={() => toggleSort('nome')}>
                  Nome <SortArrow col="nome" />
                </th>
                <th className={thBase} onClick={() => toggleSort('tipo_negocio')}>
                  Tipo <SortArrow col="tipo_negocio" />
                </th>
                <th className={thBase} onClick={() => toggleSort('status')}>
                  Status <SortArrow col="status" />
                </th>
                <th className={thBase} onClick={() => toggleSort('origem')}>
                  Origem <SortArrow col="origem" />
                </th>
                <th className={thBase} onClick={() => toggleSort('valor_estimado')}>
                  Valor <SortArrow col="valor_estimado" />
                </th>
                <th className={thBase} onClick={() => toggleSort('created_at')}>
                  Data <SortArrow col="created_at" />
                </th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-[#2a2a2a] font-mono text-xs tracking-wider">
                    NENHUM LEAD ENCONTRADO
                  </td>
                </tr>
              ) : (
                filtered.map(lead => {
                  const ss = STATUS_STYLE[lead.status] ?? { bg: '#ffffff10', color: '#666' }
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onEdit(lead)}
                      className="border-b border-[#141414] hover:bg-[#131313] transition-colors cursor-pointer group"
                    >
                      <td className={`${tdBase} text-white font-medium`}>
                        {lead.nome}
                      </td>
                      <td className={tdBase}>{lead.tipo_negocio || '—'}</td>
                      <td className={tdBase}>
                        <span
                          className="px-2 py-1 rounded-md text-[11px] font-mono font-medium"
                          style={{ backgroundColor: ss.bg, color: ss.color }}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className={tdBase}>{lead.origem || '—'}</td>
                      <td className={`${tdBase} font-mono`}>{formatBRL(lead.valor_estimado)}</td>
                      <td className={`${tdBase} font-mono text-[#333]`}>
                        {format(new Date(lead.created_at), 'dd/MM/yy', { locale: ptBR })}
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            if (window.confirm(`Deletar lead "${lead.nome}"?`)) onDelete(lead.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[#2a2a2a] hover:text-red-400 transition-all"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1.5 3.5h11M4.5 3.5V2.5a1 1 0 011-1h3a1 1 0 011 1v1M5.5 6v4.5M8.5 6v4.5M2 3.5l.875 8.25a.875.875 0 00.875.875h6.5a.875.875 0 00.875-.875L12 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-mono text-[10px] text-[#2a2a2a] mt-2 px-1">
        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
