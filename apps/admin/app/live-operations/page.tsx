import OpsPage from "../_components/ops-page";
export default function LiveOperations(){return <OpsPage title="Live Operations" intro="A control room for active duties, walker status and urgent exceptions. Live GPS, route telemetry and notifications are not connected in this demo." cards={[
{title:"Active walk monitoring",status:"NOT CONNECTED",detail:"Live map and duty status require authenticated walker devices and location permissions.",items:["Assigned → Navigating → Arrived","In Progress → End Pending → Completed","Review / Missed / Incident exceptions"]},
{title:"Location verification",status:"PLANNED",detail:"Use location accuracy and arrival-radius checks; send uncertain events to Admin review.",items:["Capture timestamp and GPS accuracy","Recheck weak accuracy after a short interval","Never silently bypass failed verification"]},
{title:"Urgent alerts",status:"MANUAL DEMO",detail:"Escalate safety concerns immediately through the approved emergency procedure.",items:["Dog escaped or injured","Walker emergency / no-show","Customer access or handover concern"]}
]}/>}
