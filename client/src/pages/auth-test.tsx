import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthTest() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleEmailSignUp() {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { alert(error.message); return }
    alert('Check your email to confirm, then come back and log in.')
  }

  async function handleEmailLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { alert(error.message); return }
    window.location.href = '/home'
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/auth-test'
  }

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Supabase test login</h2>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display:'block', marginBottom:8, width:'100%', padding:8 }} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display:'block', marginBottom:16, width:'100%', padding:8 }} />
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={handleEmailSignUp}>Create account</button>
        <button onClick={handleEmailLogin}>Log in</button>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </div>
  )
}