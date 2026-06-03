import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUSES = ['Novo', 'Contato feito', 'Proposta enviada', 'Negociando', 'Fechado', 'Perdido']

const STATUS_COLOR = {
  'Novo': '#6366f1',
  'Contato feito': '#3b82f6',
  'Proposta enviada': '#f59e0b',
  'Negociando': '#f97316',
  'Fechado': '#22c55e',
  'Perdido': '#ef4444',
}

function formatBRL(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value)
}

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function getAvatarColor(name) {
  const colors = ['#6366f1', '#3b82f6', '#f59e0b', '#f97316', '#22c55e', '#ef4444']
  const hash = name.split('').reduce((h, c) => h + c.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export default function MobileKanbanView({ leads, selectedStatus, onStatusChange, onEdit, searchTerm }) {
  const filteredLeads = useMemo(() => {
    let filtered = leads.filter(lead => lead.status === selectedStatus)
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [leads, selectedStatus, searchTerm])

  return (
    <div className="space-y-2">
      {filteredLeads.length === 0 ? (
        <div className="px-4 py-12 text-center text-[#2a2a2a] font-mono text-xs tracking-wider">
          NENHUM LEAD NESTE STATUS
        </div>
      ) : (
        filteredLeads.map(lead => (
          <MobileCard key={lead.id} lead={lead} onEdit={onEdit} />
        ))
      )}
    </div>
  )
}

function MobileCard({ lead, onEdit }) {
  return (
    <div
      onClick={() => onEdit(lead)}
      className="mx-3 p-3.5 bg-[#0e0e0e] border border-[#181818] rounded-xl cursor-pointer hover:bg-[#131313] active:bg-[#141414] transition-colors animate-fade-up"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold text-white"
          style={{ backgroundColor: getAvatarColor(lead.nome) }}
        >
          {getInitials(lead.nome)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm line-clamp-1">{lead.nome}</p>
          <p className="text-[#888] text-xs mt-0.5">{lead.telefone || '—'}</p>
        </div>
      </div>

      {/* Status badge + tipo */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <span
          className="px-2 py-1 rounded-md text-[10px] font-mono font-medium"
          style={{
            backgroundColor: `${STATUS_COLOR[lead.status]}20`,
            color: STATUS_COLOR[lead.status],
          }}
        >
          {lead.status}
        </span>
        <span className="px-2 py-1 rounded-md text-[10px] font-mono text-[#888] bg-[#161616]">
          {lead.tipo_negocio || '—'}
        </span>
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between text-xs text-[#666]">
        <span>{lead.origem || '—'}</span>
        <span className="font-mono">{format(new Date(lead.created_at), 'dd/MM', { locale: ptBR })}</span>
      </div>

      {/* Valor */}
      {lead.valor_estimado > 0 && (
        <p className="text-[#f97316] text-sm font-mono font-medium mt-2">
          {formatBRL(lead.valor_estimado)}
        </p>
      )}

      {lead.notas && (
        <p className="text-[#666] text-xs mt-2 line-clamp-2">{lead.notas}</p>
      )}
    </div>
  )
}
