import { useMemo } from 'react'

function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export default function DashboardMetrics({ leads }) {
  const m = useMemo(() => {
    const totalLeads = leads.length
    const leadsFechados = leads.filter(l => l.status === 'Fechado').length
    const valorNegociacao = leads
      .filter(l => l.status !== 'Fechado' && l.status !== 'Perdido')
      .reduce((sum, l) => sum + (Number(l.valor_estimado) || 0), 0)
    const valorFechado = leads
      .filter(l => l.status === 'Fechado')
      .reduce((sum, l) => sum + (Number(l.valor_estimado) || 0), 0)
    return { totalLeads, leadsFechados, valorNegociacao, valorFechado }
  }, [leads])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      <MetricCard
        label="Total de Leads"
        value={m.totalLeads}
        type="number"
        color="#6366f1"
        icon={<UsersIcon />}
      />
      <MetricCard
        label="Leads Fechados"
        value={m.leadsFechados}
        type="number"
        color="#22c55e"
        icon={<CheckIcon />}
      />
      <MetricCard
        label="Em Negociação"
        value={formatBRL(m.valorNegociacao)}
        type="text"
        color="#f59e0b"
        icon={<ClockIcon />}
      />
      <MetricCard
        label="Receita Fechada"
        value={formatBRL(m.valorFechado)}
        type="text"
        color="#f97316"
        icon={<TrophyIcon />}
      />
    </div>
  )
}

function MetricCard({ label, value, type, color, icon }) {
  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-lg sm:rounded-xl p-3 sm:p-5 relative overflow-hidden">
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-[0.07] pointer-events-none"
        style={{ backgroundColor: color }}
      />
      <div
        className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg flex items-center justify-center mb-2 sm:mb-4"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {icon}
      </div>
      <div className="font-mono text-lg sm:text-xl font-semibold text-white mb-0.5 sm:mb-1 leading-none">
        {type === 'number' ? value : value}
      </div>
      <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-[#3a3a3a] mt-1 sm:mt-2">
        {label}
      </div>
    </div>
  )
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 7.5c1.5 0 3 1 3 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="11" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 10.5v3M5.5 13.5h5M4 2H2.5a1 1 0 00-1 1v1a3 3 0 003 3M12 2h1.5a1 1 0 011 1v1a3 3 0 01-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8 10.5A4.5 4.5 0 013.5 6V2h9v4A4.5 4.5 0 018 10.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}
