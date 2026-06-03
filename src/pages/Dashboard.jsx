import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import DashboardMetrics from '../components/DashboardMetrics'
import KanbanBoard from '../components/KanbanBoard'
import LeadTable from '../components/LeadTable'
import LeadModal from '../components/LeadModal'
import Toast from '../components/Toast'
import MobileKanbanView from '../components/MobileKanbanView'

const STATUSES = ['Novo', 'Contato feito', 'Proposta enviada', 'Negociando', 'Fechado', 'Perdido']

export default function Dashboard({ session }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('kanban')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileSelectedStatus, setMobileSelectedStatus] = useState('Novo')

  // Calcular quantidade de leads por status
  const mobileStatusCount = useMemo(() => {
    const count = {}
    STATUSES.forEach(status => {
      count[status] = leads.filter(l => l.status === status).length
    })
    return count
  }, [leads])

  useEffect(() => {
    fetchLeads()

    function onScroll() {
      const current = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(height > 0 ? Math.min(100, Math.max(0, (current / height) * 100)) : 0)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function fetchLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('SUPABASE ERROR:', JSON.stringify(error))
    console.log('SUPABASE DATA:', data)

    if (!error) setLeads(data || [])
    setLoading(false)
  }

  function openCreate() {
    setEditingLead(null)
    setModalOpen(true)
  }

  function openEdit(lead) {
    setEditingLead(lead)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingLead(null)
  }

  async function handleSave(formData) {
    if (editingLead) {
      const { error } = await supabase
        .from('leads')
        .update(formData)
        .eq('id', editingLead.id)

      if (!error) {
        setLeads(leads.map(l => l.id === editingLead.id ? { ...l, ...formData } : l))
        setToast({ message: 'Lead atualizado com sucesso', type: 'success' })
      } else {
        setToast({ message: 'Erro ao atualizar lead', type: 'error' })
      }
    } else {
      let userId = session?.user?.id
      if (!userId) {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          console.error('Não foi possível obter o usuário logado:', authError)
          return
        }
        userId = user.id
      }

      const { data, error } = await supabase
        .from('leads')
        .insert({ ...formData, user_id: userId })
        .select()
        .single()

      console.log('SUPABASE INSERT ERROR:', JSON.stringify(error))
      console.log('SUPABASE INSERT DATA:', data)

      if (!error) {
        setLeads([data, ...leads])
        setToast({ message: 'Lead criado com sucesso', type: 'success' })
      } else {
        setToast({ message: 'Erro ao criar lead', type: 'error' })
      }
    }
    closeModal()
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    console.log('SUPABASE DELETE ERROR:', JSON.stringify(error))
    if (!error) {
      setLeads(leads.filter(l => l.id !== id))
      setToast({ message: 'Lead deletado com sucesso', type: 'success' })
    } else {
      setToast({ message: 'Falha ao deletar lead', type: 'error' })
    }
  }

  async function handleStatusChange(leadId, newStatus) {
    let previousLeads
    setLeads(currentLeads => {
      previousLeads = currentLeads
      return currentLeads.map(l => l.id === leadId ? { ...l, status: newStatus } : l)
    })

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId)

    console.log('SUPABASE STATUS UPDATE ERROR:', JSON.stringify(error))

    if (error) {
      setLeads(previousLeads)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Navbar 
        session={session} 
        mobileStatusCount={mobileStatusCount}
        selectedStatus={mobileSelectedStatus}
        onStatusChange={setMobileSelectedStatus}
      />

      <main className="flex-1 lg:ml-60 pt-14 lg:pt-0 pb-16 lg:pb-0 min-h-screen">
        <div className="p-3 sm:p-5 lg:p-8">
          {/* Header - Hidden on mobile in list view */}
          <div className="lg:flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-7 hidden lg:flex">
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white">Pipeline de Leads</h1>
              <p className="text-[#444] text-xs sm:text-sm mt-0.5 font-mono">
                {leads.length} lead{leads.length !== 1 ? 's' : ''} cadastrado{leads.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex bg-[#111] border border-[#1e1e1e] rounded-lg p-0.5 sm:p-1 gap-0.5">
                <button
                  onClick={() => setView('kanban')}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    view === 'kanban'
                      ? 'bg-[#f97316] text-white'
                      : 'text-[#555] hover:text-[#888]'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setView('tabela')}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    view === 'tabela'
                      ? 'bg-[#f97316] text-white'
                      : 'text-[#555] hover:text-[#888]'
                  }`}
                >
                  Tabela
                </button>
              </div>

              <button
                onClick={openCreate}
                className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] active:bg-[#d96109] text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[44px] sm:min-h-auto flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="hidden sm:inline">Novo Lead</span>
                <span className="sm:hidden">+</span>
              </button>
            </div>
          </div>

          {/* Desktop metrics */}
          <div className="hidden lg:block mb-5 sm:mb-7">
            <DashboardMetrics leads={leads} />
          </div>

          {/* Desktop scroll progress */}
          <div className="relative mb-3 sm:mb-4 h-0.5 rounded-full bg-[#111] overflow-hidden hidden lg:block">
            <div
              className="h-full rounded-full bg-[#f97316] transition-all duration-200 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Desktop search */}
          {view === 'kanban' && (
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 hidden lg:flex">
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar lead..."
                className="w-full sm:max-w-md bg-[#111] border border-[#1e1e1e] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-white focus:outline-none focus:border-[#f97316] transition-colors min-h-[44px] sm:min-h-auto"
              />
            </div>
          )}

          {/* Mobile header */}
          <div className="lg:hidden mb-4">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <p className="text-[#888] text-xs font-mono">{mobileStatusCount[mobileSelectedStatus]} lead(s)</p>
              </div>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] active:bg-[#d96109] text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[44px]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Novo Lead
              </button>
            </div>

            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar lead..."
              className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f97316] transition-colors min-h-[44px]"
            />
          </div>

          <div className="mt-5 sm:mt-7">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Desktop kanban/table view */}
                <div className="hidden lg:block">
                  {view === 'kanban' ? (
                    <KanbanBoard
                      leads={leads.filter(lead =>
                        lead.nome.toLowerCase().includes(searchTerm.toLowerCase())
                      )}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ) : (
                    <LeadTable
                      leads={leads}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      filterStatus={filterStatus}
                      setFilterStatus={setFilterStatus}
                      filterTipo={filterTipo}
                      setFilterTipo={setFilterTipo}
                    />
                  )}
                </div>

                {/* Mobile list view */}
                <div className="lg:hidden">
                  <MobileKanbanView
                    leads={leads}
                    selectedStatus={mobileSelectedStatus}
                    onStatusChange={setMobileSelectedStatus}
                    onEdit={openEdit}
                    searchTerm={searchTerm}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {modalOpen && (
        <LeadModal
          lead={editingLead}
          onSave={handleSave}
          onClose={closeModal}
          onDelete={handleDelete}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
