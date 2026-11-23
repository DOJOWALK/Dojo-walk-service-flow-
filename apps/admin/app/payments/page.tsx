"use client";
import {useCallback,useEffect,useState} from "react";
import {getAdminSupabase} from "../lib/supabase";

type Payment={id:string;customer_id:string;subscription_id:string;amount_inr:number;provider_reference:string|null;status:string;created_at:string;subscription?:{dog?:{name:string}|null;package?:{name:string}|null}|null};
export default function Payments(){
 const [rows,setRows]=useState<Payment[]>([]),[loading,setLoading]=useState(true),[busy,setBusy]=useState<string|null>(null),[err,setErr]=useState("");
 const load=useCallback(async()=>{const supabase=getAdminSupabase();setLoading(true);const {data,error}=await supabase.from("payments").select("id,customer_id,subscription_id,amount_inr,provider_reference,status,created_at,subscription:subscriptions(dog:dogs(name),package:service_packages(name))").order("created_at",{ascending:false});if(error)setErr(error.message);else setRows((data||[]) as unknown as Payment[]);setLoading(false)},[]);
 useEffect(()=>{void load()},[load]);
 async function review(id:string,approve:boolean){const supabase=getAdminSupabase();setBusy(id);setErr("");const {error}=await supabase.rpc("admin_review_package_payment",{p_payment_id:id,p_approve:approve});if(error)setErr(error.message);else await load();setBusy(null)}
 return <main style={{padding:30,background:"#FFF9F0",minHeight:"100vh",fontFamily:"Arial"}}><a href="/">← Owner Console</a><h1 style={{color:"#173D32"}}>Payment verification</h1><p>Manual UPI references only. Verify the actual bank/UPI credit before approving. Approval activates the subscription; customer can then save schedule.</p><button onClick={()=>void load()}>Refresh</button>{err&&<p style={{color:"#b42318"}}>{err}</p>}
 {loading?<p>Loading…</p>:rows.length===0?<p>No payment requests.</p>:<div style={{display:"grid",gap:12,marginTop:18}}>{rows.map(p=><section key={p.id} style={{background:"white",borderRadius:14,padding:18}}><div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><b>{p.subscription?.dog?.name||"Dog"} · {p.subscription?.package?.name||"Package"}</b><b>₹{p.amount_inr.toLocaleString("en-IN")}</b></div><p style={{fontSize:13,color:"#59665E"}}>Reference: {p.provider_reference||"—"}<br/>Customer ID: {p.customer_id}<br/>Status: {p.status} · {new Date(p.created_at).toLocaleString("en-IN")}</p>{p.status==="pending"&&<div style={{display:"flex",gap:8}}><button disabled={busy===p.id} onClick={()=>void review(p.id,true)} style={{background:"#173D32",color:"white",border:0,borderRadius:8,padding:11}}>Verify & activate</button><button disabled={busy===p.id} onClick={()=>void review(p.id,false)} style={{background:"#FCE8E6",color:"#A12622",border:0,borderRadius:8,padding:11}}>Reject</button></div>}</section>)}</div>}
 </main>
}
