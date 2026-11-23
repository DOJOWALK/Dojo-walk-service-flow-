import OpsPage from "../_components/ops-page";
export default function Support(){return <OpsPage title="Support & Incidents" intro="Centralize customer complaints, walker incident reports and resolution ownership. Do not treat sample queue items as real reports." cards={[
{title:"Customer support",status:"DEMO QUEUE",detail:"Categorize incoming requests and assign an accountable owner.",items:["Missed or delayed walk","Walker concern / service quality","Billing and renewal query","Customer feedback"]},
{title:"Safety incidents",status:"PRIORITY",detail:"Safety events require prompt triage and factual documentation.",items:["Dog health, bite or injury","Dog escaped / missing","Public safety issue","Customer or property access issue"]},
{title:"Resolution & audit",status:"PLANNED",detail:"Record timeline, actions, customer communication and closure reason.",items:["Assigned Admin owner","Severity and response time","Evidence and follow-up","Closure and audit history"]}
]}/>}
