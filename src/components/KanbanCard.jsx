import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function formatBRL(value) {
  if (!value) return null
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value)
}

function getInitials(name) {
  if (!name) return 'LD'
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function getAvatarColor(name) {
  const colors = ['#f97316', '#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']
  const hash = Array.from(name || 'lead').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export default function KanbanCard({ lead, onEdit, onDelete, accentColor }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { type: 'card', lead },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 999 : 'auto',
    transition: isDragging ? 'none' : 'transform 200ms ease, opacity 200ms ease',
    willChange: 'transform, opacity',
  }

  const formatted = formatBRL(lead.valor_estimado)
  const initials = getInitials(lead.nome)
  const avatarColor = getAvatarColor(lead.nome)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(lead)}
      className={`
        bg-[#161616] border border-[#202020] rounded-lg sm:rounded-xl p-2 sm:p-3.5 cursor-pointer group shadow-sm select-none animate-fade-up
        transition-all duration-200 ease-out
        ${isDragging ? 'border-[#f97316]/30 shadow-lg' : 'hover:border-[#f97316] hover:border-l-4 hover:bg-[#191919]'}
      `}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold text-white flex-shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs sm:text-sm font-semibold leading-snug line-clamp-1">{lead.nome}</p>
            <p className="text-[#7b7b7b] text-[10px] sm:text-[11px] truncate">{lead.tipo_negocio || '—'}</p>
          </div>
        </div>

        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={e => {
            e.stopPropagation()
            if (window.confirm(`Deletar lead "${lead.nome}"?`)) onDelete(lead.id)
          }}
          className="opacity-0 group-hover:opacity-100 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md text-[#7b7b7b] hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M1.5 3.5h9M4.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M4 5v4.5M7 5v4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
        <span
          className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-[#2a2a2a] text-[9px] sm:text-[11px] text-[#ccc]"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-[#f97316]">
            <path d="M5 3h14v4H5V3zm0 6h14v12H5V9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">{lead.tipo_negocio || 'Tipo'}</span>
          <span className="sm:hidden">{lead.tipo_negocio?.slice(0, 4) || 'Tipo'}</span>
        </span>
        <span
          className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-[#2a2a2a] text-[9px] sm:text-[11px] text-[#ccc]"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-[#60a5fa]">
            <path d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75S17.385 21.75 12 21.75 2.25 17.385 2.25 12 6.615 2.25 12 2.25z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 6.75v10.5M6.75 12h10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">{lead.origem || 'Orig'}</span>
          <span className="sm:hidden">{lead.origem?.slice(0, 3) || 'Orig'}</span>
        </span>
        {formatted && (
          <span
            className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-[#2a2a2a] text-[9px] sm:text-[11px] text-[#ccc]"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-[#4ade80]">
              <path d="M12 5v14M7 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">{formatted}</span>
            <span className="sm:hidden">{formatted.slice(0, 6)}</span>
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span
          className="rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] truncate"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {lead.status}
        </span>
        <span className="text-[#5a5a5a] text-[9px] sm:text-[10px] font-mono flex-shrink-0">
          {format(new Date(lead.created_at), 'dd/MM', { locale: ptBR })}
        </span>
      </div>
    </div>
  )
}
