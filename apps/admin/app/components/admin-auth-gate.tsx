"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient, type SupabaseClient, type Session } from "@supabase/supabase-js";

type LoginMode = "password" | "otp";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const client = useMemo<SupabaseClient | null>(() => url && key ? createClient(url, key) : null, [url, key]);
  const [status, setStatus] = useState<"loading" | "signedOut" | "ready" | "denied">("loading");
  const [mode, setMode] = useState<LoginMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function checkRole(next: Session | null) {
    if (!next || !client) { setStatus("signedOut"); return; }
    const { data, error: profileError } = await client.from("profiles").select("role").eq("id", next.user.id).single();
    if (profileError || data?.role !== "admin") { setStatus("denied"); return; }
    setStatus("ready");
  }

  useEffect(() => {
    if (!client) { setStatus("signedOut"); return; }
    let active = true;
    client.auth.getSession().then(({ data }) => { if (active) void checkRole(data.session); });
    const { data } = client.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      if (!next) setStatus("signedOut");
      else { setStatus("loading"); setTimeout(() => { if (active) void checkRole(next); }, 0); }
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [client]);

  async function signInWithPassword() {
    if (!client) return;
    setBusy(true); setError("");
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    await checkRole(data.session);
  }

  async function sendOtp() {
    if (!client) return;
    setBusy(true); setError("");
    const { error } = await client.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { shouldCreateUser: false } });
    setBusy(false);
    if (error) setError(error.message); else setSent(true);
  }

  async function verifyOtp() {
    if (!client) return;
    setBusy(true); setError("");
    const { data, error } = await client.auth.verifyOtp({ email: email.trim().toLowerCase(), token: otp.trim(), type: "email" });
    setBusy(false);
    if (error) { setError(error.message); return; }
    await checkRole(data.session);
  }

  const inputStyle = { width: "100%", boxSizing: "border-box" as const, padding: 14, border: "1px solid #ddd", borderRadius: 10, margin: "8px 0" };
  const buttonStyle = { flex: 1, padding: 11, border: "1px solid #dce5df", borderRadius: 9, fontWeight: 800, cursor: "pointer" as const };

  if (status === "ready") return <>{children}</>;
  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#f7f5ef",padding:24,fontFamily:"Arial,sans-serif"}}>
    <section style={{width:"100%",maxWidth:420,background:"#fff",padding:32,borderRadius:20,boxShadow:"0 12px 40px #173d3214"}}>
      <p style={{fontSize:11,fontWeight:900,letterSpacing:2,color:"#F28C28"}}>DOJO WALK · OWNER ACCESS</p>
      <h1 style={{color:"#173D32",fontSize:28,margin:"12px 0"}}>Admin sign in</h1>
      {!client ? <p>Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in the Admin environment.</p> :
        status === "loading" ? <p>Secure session check…</p> :
        status === "denied" ? <><p>This account is not provisioned as an Admin. Access denied.</p><button onClick={()=>void client.auth.signOut()}>Sign out</button></> :
        <>
          <p style={{color:"#68736d",lineHeight:1.5}}>Owner-only access. Use your approved Admin account.</p>
          <div style={{display:"flex",gap:8,margin:"18px 0 10px"}}>
            <button type="button" onClick={()=>{setMode("password");setError("");}} style={{...buttonStyle,background:mode==="password"?"#173D32":"#fff",color:mode==="password"?"#fff":"#173D32"}}>Password</button>
            <button type="button" onClick={()=>{setMode("otp");setError("");}} style={{...buttonStyle,background:mode==="otp"?"#173D32":"#fff",color:mode==="otp"?"#fff":"#173D32"}}>OTP (optional)</button>
          </div>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin email" type="email" autoComplete="username" style={inputStyle}/>
          {mode === "password" ? (
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" autoComplete="current-password" style={inputStyle}/>
          ) : (
            sent && <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Email OTP" inputMode="numeric" autoComplete="one-time-code" style={inputStyle}/>
          )}
          {error && <p style={{color:"#b42318",lineHeight:1.4}}>{error}</p>}
          <button disabled={busy || !email.trim() || (mode==="password" ? !password : sent && !otp.trim())} onClick={()=>void (mode==="password"?signInWithPassword():sent?verifyOtp():sendOtp())} style={{width:"100%",padding:15,border:0,borderRadius:10,background:"#173D32",color:"#fff",fontWeight:800,cursor:"pointer",opacity:busy?0.7:1}}>
            {busy?"Please wait…":mode==="password"?"Sign in with password":sent?"Verify OTP":"Send OTP"}
          </button>
          {mode==="password" && <p style={{fontSize:12,color:"#68736d",lineHeight:1.5,marginTop:14}}>If this Admin account has no password yet, set one securely in the Supabase Auth user settings before signing in.</p>}
        </>
      }
    </section>
  </main>;
}
