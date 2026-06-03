import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import KanbanCard from './KanbanCard'

const STATUSES = [
  'Novo',
  'Contato feito',
  'Proposta enviada',
  'Negociando',
  'Fechado',
  'Perdido',
]

const STATUS_META = {
  'Novo':              { color: '#6366f1', dot: '#818cf8' },
  'Contato feito':     { color: '#3b82f6', dot: '#60a5fa' },
  'Proposta enviada':  { color: '#f59e0b', dot: '#fbbf24' },
  'Negociando':        { color: '#f97316', dot: '#fb923c' },
  'Fechado':           { color: '#22c55e', dot: '#4ade80' },
  'Perdido':           { color: '#ef4444', dot: '#f87171' },
}

function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value || 0)
}

function KanbanColumn({ status, leads, onEdit, onDelete }) {
  const meta = STATUS_META[status]
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: 'column', status },
  })

  const total = leads.reduce((s, l) => s + (Number(l.valor_estimado) || 0), 0)

  return (
    <div className="flex-shrink-0 w-[224px] xl:w-[252px]">
      {/* Column header */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.dot }} />
          <span className="text-[#aaa] text-xs font-medium">{status}</span>
        </div>
        <span
          className="font-mono text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: `${meta.color}15`, color: meta.dot }}
        >
          {leads.length}
        </span>
      </div>

      {total > 0 && (
        <p className="font-mono text-[10px] text-[#2e2e2e] mb-2 px-0.5">{formatBRL(total)}</p>
      )}

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`min-h-[180px] rounded-xl border p-2 space-y-2 transition-colors duration-200 ease-out ${
          isOver
            ? 'border-[#f97316]/30 bg-[#f97316]/[0.03]'
            : 'border-[#181818] bg-[#0c0c0c]'
        }`}
      >
        {leads.map(lead => (
          <KanbanCard
            key={lead.id}
            lead={lead}
            onEdit={onEdit}
            onDelete={onDelete}
            accentColor={meta.dot}
          />
        ))}

        {leads.length === 0 && !isOver && (
          <div className="flex items-center justify-center h-14 text-[#222] text-[10px] font-mono tracking-wider">
            VAZIO
          </div>
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard({ leads, onEdit, onDelete, onStatusChange }) {
  const [activeLead, setActiveLead] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  function handleDragStart({ active }) {
    setActiveLead(active.data.current?.lead ?? null)
  }

  function handleDragEnd({ active, over }) {
    setActiveLead(null)
    if (!over) return

    const overData = over.data.current
    if (overData?.type !== 'column') return

    const newStatus = overData.status
    const lead = active.data.current?.lead
    if (lead && lead.status !== newStatus) {
      onStatusChange(lead.id, newStatus)
    }
  }

  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = leads
      .filter(l => l.status === s)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return acc
  }, {})

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-6 scroll-smooth">
        {STATUSES.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            leads={byStatus[status]}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {activeLead && (
          <div className="bg-[#1e1e1e] border border-[#f97316]/40 rounded-xl p-3.5 w-[224px] shadow-2xl rotate-[1.5deg] cursor-grabbing transition-transform duration-200 ease-out">
            <p className="text-white text-[13px] font-medium leading-snug">{activeLead.nome}</p>
            {activeLead.tipo_negocio && (
              <p className="text-[#3a3a3a] text-[11px] font-mono mt-1.5">{activeLead.tipo_negocio}</p>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
