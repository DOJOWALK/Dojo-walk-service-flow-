import React from "react";
const green="#173D32",orange="#F28C28",cream="#FFF9F0",mint="#E7EFE9";
type OpsPageProps={title:string;eyebrow?:string;intro:string;cards:{title:string;status:string;detail:string;items?:string[]}[];note?:string};
export default function OpsPage({title,eyebrow="OWNER OPERATIONS",intro,cards,note="Demo interface only. Connect authenticated APIs and role permissions before using with real customer or walker data."}:OpsPageProps){
 return <main style={{padding:"28px 22px",maxWidth:1180,margin:"0 auto",color:"#202820"}}>
 <a href="/" style={{color:green,fontWeight:800,textDecoration:"none"}}>← Owner dashboard</a>
 <p style={{color:orange,fontWeight:900,letterSpacing:1.8,fontSize:10,marginTop:24}}>{eyebrow} · DOJO WALK</p>
 <h1 style={{color:green,fontSize:30,fontWeight:900,margin:"8px 0"}}>{title}</h1>
 <p style={{color:"#718078",fontSize:13,lineHeight:1.6,maxWidth:760}}>{intro}</p>
 <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginTop:24}}>
 {cards.map(card=><article key={card.title} style={{background:"white",border:"1px solid #ecece5",borderRadius:16,padding:18}}>
 <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}><h2 style={{fontSize:16,color:green,margin:0}}>{card.title}</h2><span style={{fontSize:10,fontWeight:900,color:orange,background:"#fff0df",padding:"6px 9px",borderRadius:20}}>{card.status}</span></div>
 <p style={{fontSize:12,color:"#718078",lineHeight:1.6}}>{card.detail}</p>
 {card.items?.map(item=><div key={item} style={{fontSize:12,color:"#34443b",padding:"9px 0",borderTop:"1px solid #f0f0eb"}}>• {item}</div>)}
 </article>)}
 </section>
 <div style={{background:mint,borderRadius:14,padding:15,marginTop:20,color:green,fontSize:12,lineHeight:1.6}}>{note}</div>
 </main>
}