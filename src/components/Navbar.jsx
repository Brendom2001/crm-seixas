import { supabase } from '../lib/supabaseClient'

export default function Navbar({ session }) {
  const email = session?.user?.email || ''
  const initials = email.slice(0, 2).toUpperCase()

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d] border-b border-[#181818] px-3 sm:px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoMark size={28} />
          <span className="font-display text-xs sm:text-sm font-bold text-white tracking-tight">SEIXAS</span>
        </div>
        <button
          onClick={handleLogout}
          className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#444] hover:text-[#f97316] transition-colors px-2 py-2"
        >
          Sair
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d0d] border-r border-[#181818] flex-col z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#181818]">
          <div className="flex items-center gap-3">
            <LogoMark size={34} />
            <div>
              <div className="font-display text-[13px] font-bold text-white tracking-tight leading-none">SEIXAS AGENCY</div>
              <div className="font-mono text-[9px] text-[#2e2e2e] tracking-widest mt-1">CRM v1.0</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#2a2a2a] px-3 mb-2">Menu</p>
          <NavItem icon={<PipelineIcon />} label="Pipeline" active />
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-[#181818]">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center font-mono text-[10px] text-[#555] flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate leading-none">{email}</p>
              <p className="text-[#333] text-[10px] font-mono mt-0.5">Agente</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#444] hover:text-[#f97316] hover:bg-[#f97316]/5 text-sm transition-all group"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
              <path d="M5.5 13H3a1 1 0 01-1-1V3a1 1 0 011-1h2.5M10 10.5l3-3-3-3M13 7.5H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}

function NavItem({ icon, label, active }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-[#f97316]/10 text-[#f97316]'
          : 'text-[#444] hover:text-[#888] hover:bg-[#161616]'
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {label}
    </button>
  )
}

function LogoMark({ size = 32 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="bg-[#f97316] rounded-[6px] flex items-center justify-center flex-shrink-0"
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="12" rx="1" fill="white" />
        <rect x="9" y="2" width="5" height="7" rx="1" fill="white" />
      </svg>
    </div>
  )
}

function PipelineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="5" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="8" y="1" width="5" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
