import OpsPage from "../_components/ops-page";
export default function Schedules(){return <OpsPage title="Schedules & Walks" intro="Prepare recurring customer schedules, publish the next-day duty roster and monitor walk lifecycle exceptions. One dog per walk; permanent primary walker is retained for monthly customers wherever feasible." cards={[
{title:"Next-day publishing",status:"ADMIN ACTION",detail:"Review recurring duties before publishing tomorrow's schedule.",items:["Check morning window · 05:00–11:00","Check evening window · 16:00–22:00","Resolve overlaps and travel-time conflicts","Publish approved roster to assigned walkers"]},
{title:"Recurring schedule rules",status:"POLICY",detail:"Generate duties from active package days and selected Single or Double service.",items:["Single = one selected time window","Double = morning and evening duties","One dog per duty","No customer self-selection of walkers"]},
{title:"Exceptions queue",status:"DEMO",detail:"Review incomplete or disrupted walks.",items:["End pending / proof missing","Late arrival or missed duty","Incident / safety escalation","Backup duty confirmation"]}
]}/>}
