import { useState, useEffect, useRef } from 'react'

const TIPOS    = ['Clínica Dental', 'Clínica Estética', 'Outro']
const STATUSES = ['Novo', 'Contato feito', 'Proposta enviada', 'Negociando', 'Fechado', 'Perdido']
const ORIGENS  = ['Instagram', 'Prospecção ativa', 'Indicação', 'Outro']

const STATUS_COLOR = {
  'Novo':              '#818cf8',
  'Contato feito':     '#60a5fa',
  'Proposta enviada':  '#fbbf24',
  'Negociando':        '#fb923c',
  'Fechado':           '#4ade80',
  'Perdido':           '#f87171',
}

const BLANK = {
  nome: '',
  telefone: '',
  tipo_negocio: 'Clínica Dental',
  status: 'Novo',
  origem: 'Instagram',
  valor_estimado: '',
  notas: '',
}

export default function LeadModal({ lead, onSave, onClose, onDelete }) {
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const drawerRef = useRef(null)

  useEffect(() => {
    setForm(lead
          ? {
          nome:          lead.nome          ?? '',
          telefone:      lead.telefone      ?? '',
          tipo_negocio:  lead.tipo_negocio  ?? 'Clínica Dental',
          status:        lead.status        ?? 'Novo',
          origem:        lead.origem        ?? 'Instagram',
          valor_estimado: lead.valor_estimado != null ? String(lead.valor_estimado) : '',
          notas:         lead.notas         ?? '',
        }
      : BLANK
    )
    setConfirmDelete(false)
  }, [lead])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...form,
      valor_estimado: form.valor_estimado !== '' ? parseFloat(form.valor_estimado) : null,
    })
    setSaving(false)
  }

  async function handleDelete() {
    await onDelete(lead.id)
    onClose()
  }

  const inputClass = 'w-full bg-[#161616] border border-[#202020] rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-[#2e2e2e] focus:outline-none focus:border-[#f97316] transition-colors'
  const labelClass = 'block font-mono text-[9px] uppercase tracking-[0.2em] text-[#3a3a3a] mb-2'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-[520px] max-h-[90vh] overflow-hidden bg-[#0f0f0f] border border-[#1a1a1a] flex flex-col rounded-lg shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a] flex-shrink-0">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              {lead ? 'Editar Lead' : 'Novo Lead'}
            </h2>
            {lead && (
              <p className="font-mono text-[10px] text-[#2e2e2e] mt-0.5">
                ID #{lead.id.slice(0, 8).toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#3a3a3a] hover:text-white hover:bg-[#1e1e1e] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome *</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                placeholder="Nome do lead"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Contato</label>
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="Telefone ou @usuario (Instagram)"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tipo de Negócio</label>
              <select name="tipo_negocio" value={form.tipo_negocio} onChange={handleChange} className={inputClass}>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Origem</label>
              <select name="origem" value={form.origem} onChange={handleChange} className={inputClass}>
                {ORIGENS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelClass}>Status</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map(s => {
                  const active = form.status === s
                  const color = STATUS_COLOR[s]
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, status: s }))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                        active
                          ? 'border-transparent'
                          : 'border-[#1e1e1e] text-[#444] hover:border-[#2a2a2a] hover:text-[#666]'
                      }`}
                      style={active ? {
                        backgroundColor: `${color}12`,
                        borderColor: `${color}30`,
                        color,
                      } : {}}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: active ? color : '#2a2a2a' }}
                      />
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className={labelClass}>Valor Estimado (R$)</label>
              <input
                name="valor_estimado"
                value={form.valor_estimado}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Notas</label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              rows={4}
              placeholder="Observações, próximos passos..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#f97316] hover:bg-[#ea6c0a] active:bg-[#d96109] text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            >
              {saving
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    Salvando...
                  </span>
                : (lead ? 'Salvar alterações' : 'Criar lead')
              }
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#1e1e1e] text-[#444] hover:text-white hover:border-[#2a2a2a] text-sm transition-all"
            >
              Cancelar
            </button>
          </div>

          {/* Delete */}
          {lead && (
            <div className="pt-1">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-2.5 rounded-lg border border-[#1e1e1e] text-[#333] hover:text-red-400/80 hover:border-red-400/20 text-sm transition-all"
                >
                  Deletar lead
                </button>
              ) : (
                <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                  <p className="text-red-400/80 text-sm mb-3">
                    Deletar <strong className="text-red-400">{lead.nome}</strong>? Ação irreversível.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex-1 bg-red-500/80 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Deletar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 border border-[#1e1e1e] text-[#444] hover:text-white py-2 rounded-lg text-sm transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
