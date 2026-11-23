export type WalkStatus="assigned"|"navigating"|"arrived"|"in_progress"|"end_pending"|"completed"|"review"|"missed"|"incident";
const transitions:Record<WalkStatus,WalkStatus[]>={assigned:["navigating","missed"],navigating:["arrived","review","missed"],arrived:["in_progress","review"],in_progress:["end_pending","incident"],end_pending:["completed","review","incident"],completed:[],review:["completed","missed","incident"],missed:[],incident:["review"]};
export function canTransition(from:WalkStatus,to:WalkStatus){return transitions[from].includes(to)}
export function transitionWalk(from:WalkStatus,to:WalkStatus):WalkStatus{if(!canTransition(from,to))throw new Error("Invalid walk transition: "+from+" → "+to);return to}
export type BookingKind="monthly"|"temporary";
export function validateBooking(kind:BookingKind,days:number,duration:30|45|60,walksPerDay:1|2){
 if(kind==="monthly"&&days!==30)throw new Error("Monthly plans must be exactly 30 days");
 if(kind==="temporary"&&(days<1||days>15))throw new Error("Temporary plans must be 1–15 days");
 if(![30,45,60].includes(duration))throw new Error("Unsupported walk duration");
 if(![1,2].includes(walksPerDay))throw new Error("Choose Single or Double walk");
 return true;
}
export function canAssignDog(currentAssignedDogs:number){return currentAssignedDogs<10}
export type HandoverStatus="walker_requested"|"customer_consented"|"admin_approved"|"rejected"|"completed";
export function canCompleteHandover(status:HandoverStatus){return status==="admin_approved"}
