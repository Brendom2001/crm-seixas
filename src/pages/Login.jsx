import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email ou senha inválidos.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[480px] flex-shrink-0 bg-[#0d0d0d] border-r border-[#181818] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#f97316]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#f97316]/4 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative">
          <LogoMark size={36} />
          <div>
            <div className="font-display text-base font-bold text-white tracking-tight leading-none">SEIXAS AGENCY</div>
            <div className="font-mono text-[10px] text-[#3a3a3a] tracking-widest mt-0.5">CRM SYSTEM</div>
          </div>
        </div>

        <div className="relative">
          <div className="font-mono text-xs text-[#f97316]/60 tracking-[0.3em] mb-6 uppercase">
            Pipeline // Leads // Conversões
          </div>
          <h1 className="font-display text-[3.25rem] font-extrabold text-white leading-[1.05] mb-6">
            Seus leads.<br />
            Seu pipeline.<br />
            <span className="text-[#f97316]">Sua agência.</span>
          </h1>
          <p className="text-[#444] text-base leading-relaxed max-w-xs">
            Gerencie prospecções e clientes em um único lugar. Feito para a Seixas Agency.
          </p>
        </div>

        <div className="font-mono text-[11px] text-[#2a2a2a] relative">
          © 2024 Seixas Agency — Sapiranga/RS
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[360px]">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <LogoMark size={28} />
            <span className="font-display text-base font-bold text-white">SEIXAS AGENCY</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-white mb-1.5">Entrar</h2>
            <p className="text-[#444] text-sm">Acesso restrito à equipe</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#f97316] transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#f97316] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/8 border border-red-500/15 rounded-lg px-4 py-3 text-red-400/90 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f97316] hover:bg-[#ea6c0a] active:bg-[#d96109] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
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
