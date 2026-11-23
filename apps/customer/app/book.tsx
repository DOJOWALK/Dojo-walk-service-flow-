import React from "react";
import {ScrollView,View,Text,Pressable,StyleSheet,ActivityIndicator} from "react-native";
import { requireSupabase } from "../lib/supabase";
const g="#173D32",o="#F28C28",c="#FFF9F0",m="#E7EFE9";
const money=(n:number)=>"₹"+Math.round(n).toLocaleString("en-IN");
type ServicePackage={id:string;name:string;plan_type:"monthly"|"temporary";walks_per_day:number;duration_minutes:number;duration_days:number;price_inr:number|null;requires_admin_quote:boolean};
export default function Book(){
 const[k,setK]=React.useState<"Monthly"|"Temporary">("Monthly");
 const[d,setD]=React.useState(30);const[t,setT]=React.useState(30);const[w,setW]=React.useState<"Single"|"Double">("Single");
 const[slot,setSlot]=React.useState<"Morning"|"Evening">("Morning");const[area,setArea]=React.useState("Gaur City 2");const[confirmed,setConfirmed]=React.useState(false);
 const[packages,setPackages]=React.useState<ServicePackage[]>([]);const[loading,setLoading]=React.useState(true);const[loadError,setLoadError]=React.useState("");
 React.useEffect(()=>{let active=true;(async()=>{try{const {data,error}=await requireSupabase().from("service_packages").select("id,name,plan_type,walks_per_day,duration_minutes,duration_days,price_inr,requires_admin_quote").eq("active",true).order("duration_days").order("walks_per_day").order("duration_minutes");if(error)throw error;if(active)setPackages((data||[]) as ServicePackage[])}catch(e){if(active)setLoadError(e instanceof Error?e.message:"Package catalogue load nahi hua.")}finally{if(active)setLoading(false)}})();return()=>{active=false}},[]);
 const pick=(arr:string[],v:string,fn:(x:string)=>void)=><View style={s.wrap}>{arr.map(x=><Pressable key={x} onPress={()=>fn(x)} style={[s.chip,x===v&&s.on]}><Text style={{color:x===v?"white":g,fontWeight:"800",fontSize:12}}>{x}</Text></Pressable>)}</View>;
 const changeKind=(x:"Monthly"|"Temporary")=>{setK(x);setD(x==="Monthly"?30:1);setConfirmed(false)};
 const selectedPackage=packages.find(p=>p.plan_type===(k==="Monthly"?"monthly":"temporary")&&p.duration_days===d&&p.duration_minutes===t&&p.walks_per_day===(w==="Single"?1:2));
 const hasApprovedPrice=!!selectedPackage&&!selectedPackage.requires_admin_quote&&selectedPackage.price_inr!==null;
 const total=hasApprovedPrice?selectedPackage!.price_inr:null;
 return <ScrollView style={s.page} contentContainerStyle={s.body}>
 <Text style={s.kicker}>DOJO WALK · BOOKING</Text><Text style={s.title}>A happy routine starts here.</Text>
 <Text style={s.label}>1. Booking type</Text>{pick(["Monthly","Temporary"],k,x=>changeKind(x as "Monthly"|"Temporary"))}
 <Text style={s.helper}>{k==="Monthly"?"30-day recurring package · best for a regular routine.":"Short-term service · choose 1–15 days."}</Text>
 <Text style={s.label}>2. Package days</Text>{pick((k==="Monthly"?[30]:Array.from({length:15},(_,i)=>i+1)).map(x=>x+" days"),d+" days",x=>{setD(Number(x.split(" ")[0]));setConfirmed(false)})}
 <Text style={s.label}>3. Walk duration</Text>{pick(["30 min","45 min","60 min"],t+" min",x=>{setT(Number(x.split(" ")[0]));setConfirmed(false)})}
 <Text style={s.label}>4. Service</Text>{pick(["Single","Double"],w,x=>{setW(x as "Single"|"Double");setConfirmed(false)})}
 <Text style={s.helper}>{w==="Single"?"One walk per selected day, morning OR evening.":"Two walks per selected day: one morning AND one evening."}</Text>
 <Text style={s.label}>5. Preferred schedule</Text>{pick(["Morning","Evening"],slot,x=>setSlot(x as "Morning"|"Evening"))}
 <Text style={s.sub}>{slot==="Morning"?"Morning window: 5:00 AM – 11:00 AM":"Evening window: 4:00 PM – 10:00 PM"}{w==="Double"?" · Double package includes both windows.":""}</Text>
 <Text style={s.label}>6. Service area</Text>{pick(["Gaur City 2","Gaur City 1","Crossings Republik"],area,setArea)}
 <View style={s.summary}><Text style={s.summaryTitle}>Live package price</Text>
 {loading?<View style={{flexDirection:"row",alignItems:"center",gap:8,marginTop:10}}><ActivityIndicator color={g}/><Text style={s.sub}>Staging catalogue load ho raha hai…</Text></View>:
 <Text style={s.price}>{total===null?"Admin quote required":money(total!)}</Text>}
 <Text style={s.summaryText}>{k} · {d} days · {t} min · {w} Walk</Text><Text style={s.summaryText}>{w==="Double"?"Morning + Evening":"Preferred: "+slot} · {area}</Text>
 <Text style={s.sub}>{t===30?"30-minute prices are read directly from DOJO WALK's approved staging rate card.":"45/60-minute plans are quote-only; no estimated price is shown."}</Text>
 {loadError!==""&&<Text style={s.error}>Catalogue error: {loadError}</Text>}
 {!loading&&!loadError&&!selectedPackage&&<Text style={s.sub}>This combination has no published package row. Admin quote required.</Text>}
 </View>
 <Pressable disabled={loading} onPress={()=>setConfirmed(true)} style={[s.button,loading&&{opacity:.5}]}><Text style={s.buttonText}>Continue →</Text></Pressable>
 {confirmed&&<Text style={s.notice}>{total===null?"This selection needs an Admin quote.":"Selected staging package: "+money(total!)} This screen does not reserve a slot or collect payment yet. Add your dog profile and submit the booking request after the service flow is enabled.</Text>}
 <Text style={s.footer}>One dog per walk · Monthly customers receive a company-assigned primary walker. Temporary assignments depend on availability.</Text>
 </ScrollView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:c},body:{padding:22,paddingBottom:50},kicker:{color:o,fontWeight:"900",letterSpacing:1.5,fontSize:10},title:{fontSize:27,color:g,fontWeight:"900",marginTop:10,marginBottom:16},label:{fontSize:12,color:g,fontWeight:"900",marginTop:18,marginBottom:9},wrap:{flexDirection:"row",flexWrap:"wrap",gap:8},chip:{paddingVertical:11,paddingHorizontal:13,borderRadius:22,backgroundColor:"white",borderWidth:1,borderColor:"#e8e3d9"},on:{backgroundColor:g,borderColor:g},sub:{fontSize:11,color:"#718078",marginTop:7,lineHeight:17},helper:{fontSize:11,color:"#718078",marginTop:8,lineHeight:16},summary:{backgroundColor:m,padding:17,borderRadius:16,marginTop:24},summaryTitle:{fontSize:16,color:g,fontWeight:"900"},price:{fontSize:30,color:g,fontWeight:"900",marginTop:8},summaryText:{fontSize:13,color:g,fontWeight:"800",marginTop:8},error:{fontSize:11,color:"#b42318",marginTop:8},button:{backgroundColor:o,padding:16,borderRadius:14,alignItems:"center",marginTop:20},buttonText:{color:"white",fontWeight:"900"},notice:{color:g,fontSize:12,marginTop:12,lineHeight:18},footer:{fontSize:11,color:"#718078",marginTop:24,lineHeight:18}});
