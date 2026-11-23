import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Session } from "@supabase/supabase-js";
import { requireSupabase, supabase, isSupabaseConfigured } from "../lib/supabase";

type Props = { expectedRole: "customer" | "walker"; children: React.ReactNode };

export function AuthGate({ expectedRole, children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "signedOut" | "ready" | "wrongRole">("loading");
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function loadRole(current: Session | null) {
    setSession(current);
    if (!current) { setRole(null); setStatus("signedOut"); return; }
    try {
      const { data, error } = await requireSupabase()
        .from("profiles").select("role").eq("id", current.user.id).single();
      if (error) throw error;
      const actualRole = String(data.role);
      setRole(actualRole);
      setStatus(actualRole === expectedRole || actualRole === "admin" ? "ready" : "wrongRole");
    } catch (error) {
      setRole(null);
      setStatus("wrongRole");
    }
  }

  useEffect(() => {
    if (!supabase) { setStatus("signedOut"); return; }
    let active = true;
    supabase.auth.getSession().then(({ data }) => { if (active) void loadRole(data.session); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) void loadRole(nextSession);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [expectedRole]);

  async function sendCode() {
    if (!email.trim()) { Alert.alert("Email required", "Apna registered email address daalein."); return; }
    setBusy(true);
    try {
      const { error } = await requireSupabase().auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: expectedRole === "customer" },
      });
      if (error) throw error;
      setCodeSent(true);
      Alert.alert("OTP sent", "Email par aaya 6-digit code enter karein.");
    } catch (error) {
      Alert.alert("Login nahi hua", error instanceof Error ? error.message : "Please try again.");
    } finally { setBusy(false); }
  }

  async function verifyCode() {
    if (token.trim().length < 6) { Alert.alert("OTP daalein", "Email par aaya code enter karein."); return; }
    setBusy(true);
    try {
      const { data, error } = await requireSupabase().auth.verifyOtp({
        email: email.trim().toLowerCase(), token: token.trim(), type: "email",
      });
      if (error) throw error;
      await loadRole(data.session);
    } catch (error) {
      Alert.alert("OTP verify nahi hua", error instanceof Error ? error.message : "Please try again.");
    } finally { setBusy(false); }
  }

  if (status === "ready") return <>{children}</>;
  if (status === "loading") return <View style={styles.center}><ActivityIndicator color="#F28C28"/><Text style={styles.muted}>DOJO WALK secure login…</Text></View>;

  return <View style={styles.page}>
    <Text style={styles.kicker}>DOJO WALK · SECURE ACCESS</Text>
    <Text style={styles.title}>{expectedRole === "customer" ? "Welcome to DOJO WALK" : "Walker Partner Login"}</Text>
    {!isSupabaseConfigured ? <Text style={styles.message}>Staging connection set karne ke liye app folder mein .env file banayein aur EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY set karein.</Text> :
      status === "wrongRole" ? <>
        <Text style={styles.message}>{role ? `Is account ka role “${role}” hai. ` : "Profile abhi provision nahi hua. "}{expectedRole === "walker" ? "Walker access Admin approval ke baad milega." : "Customer account se login karein."}</Text>
        <Pressable style={styles.button} onPress={() => { void requireSupabase().auth.signOut(); }}><Text style={styles.buttonText}>Sign out</Text></Pressable>
      </> : <>
        <Text style={styles.message}>Email par one-time code bhejkar secure login karein.</Text>
        <TextInput style={styles.input} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail}/>
        {codeSent && <TextInput style={styles.input} placeholder="6-digit email OTP" keyboardType="number-pad" value={token} onChangeText={setToken}/>}
        <Pressable style={styles.button} disabled={busy} onPress={() => void (codeSent ? verifyCode() : sendCode())}>
          <Text style={styles.buttonText}>{busy ? "Please wait…" : codeSent ? "Verify OTP" : "Send OTP"}</Text>
        </Pressable>
        {codeSent && <Pressable onPress={() => { setCodeSent(false); setToken(""); }}><Text style={styles.link}>Change email</Text></Pressable>}
      </>}
  </View>;
}

const styles = StyleSheet.create({
  page:{flex:1,backgroundColor:"#FFF9F0",justifyContent:"center",padding:26},
  center:{flex:1,backgroundColor:"#FFF9F0",alignItems:"center",justifyContent:"center",gap:12},
  kicker:{fontSize:10,letterSpacing:2,fontWeight:"900",color:"#F28C28"},
  title:{fontSize:28,fontWeight:"900",color:"#173D32",marginTop:12},
  message:{fontSize:14,lineHeight:21,color:"#59665E",marginTop:12,marginBottom:18},
  input:{backgroundColor:"#fff",borderWidth:1,borderColor:"#E8E3D9",borderRadius:14,padding:15,fontSize:15,marginBottom:12},
  button:{backgroundColor:"#173D32",padding:16,borderRadius:14,alignItems:"center",marginTop:4},
  buttonText:{color:"#fff",fontWeight:"900"},
  link:{color:"#F28C28",fontWeight:"800",textAlign:"center",marginTop:18},
  muted:{color:"#718078",fontSize:13}
});
