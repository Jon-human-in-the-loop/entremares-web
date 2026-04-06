'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setErrorMsg('Invalid credentials. Please try again.')
      setStatus('error')
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-dark-brown tracking-widest uppercase">
            Entremares
          </h1>
          <p className="text-xs text-text-muted font-sans tracking-[0.3em] uppercase mt-2">
            Admin Panel
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border-light shadow-sm p-8">
          <h2 className="text-lg font-serif font-bold text-dark-brown mb-6 text-center">
            Sign In
          </h2>

          {status === 'error' && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-sans">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@entremares.pt"
                  className="w-full pl-9 pr-4 py-3 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted/50 focus:outline-none focus:border-dark-brown transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-3 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted/50 focus:outline-none focus:border-dark-brown transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full mt-2 bg-dark-brown text-cream font-sans font-semibold text-sm py-3.5 rounded-full hover:bg-dark-brown/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-text-muted/40 font-sans mt-6 uppercase tracking-widest">
          Restricted area · Entremares
        </p>
      </div>
    </div>
  )
}
