import OpsPage from "../_components/ops-page";
export default function Reports(){return <OpsPage title="Reports & Audit" intro="Operational and financial reporting should use verified backend records, not editable demo counters. Keep customer collections separate from walker payroll." cards={[
{title:"Service performance",status:"PLANNED",detail:"Measure reliable delivery and customer experience.",items:["Completed, missed and reviewed walks","On-time arrival and duration variance","Customer feedback and complaint trends","Area-wise demand and capacity"]},
{title:"Finance reports",status:"PLANNED",detail:"Reconcile customer collections and walker payouts independently.",items:["Package sales and renewals","Outstanding customer invoices","Verified completed-walk credits","Monthly walker payout register"]},
{title:"Audit trail",status:"REQUIRED",detail:"Record who changed an assignment, approved leave or authorized a handover.",items:["Actor, timestamp and action","Before/after values","Approval reason and evidence","Exportable review history"]}
]}/>}
