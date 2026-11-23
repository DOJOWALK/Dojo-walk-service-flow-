export type WalkStatus="assigned"|"navigating"|"arrived"|"in_progress"|"end_pending"|"completed"|"review"|"missed"|"incident";
const transitions:Record<WalkStatus,WalkStatus[]>={assigned:["navigating","missed"],navigating:["arrived","review","missed"],arrived:["in_progress","review"],in_progress:["end_pending","incident"],end_pending:["completed","review","incident"],completed:[],review:["completed","missed","incident"],missed:[],incident:["review"]};
export function canTransition(from:WalkStatus,to:WalkStatus){return transitions[from].includes(to)}
export function transitionWalk(from:WalkStatus,to:WalkStatus):WalkStatus{if(!canTransition(from,to))throw new Error("Invalid walk transition: "+from+" → "+to);return to}

export type BookingKind="monthly"|"temporary";
export type WalkDuration=30|45|60;
export type WalksPerDay=1|2;
export function validateBooking(kind:BookingKind,days:number,duration:WalkDuration,walksPerDay:WalksPerDay){
 if(!Number.isInteger(days))throw new Error("Booking days must be a whole number");
 if(kind==="monthly"&&days!==30)throw new Error("Monthly plans must be exactly 30 days");
 if(kind==="temporary"&&(days<1||days>15))throw new Error("Temporary plans must be 1–15 days");
 if(![30,45,60].includes(duration))throw new Error("Unsupported walk duration");
 if(![1,2].includes(walksPerDay))throw new Error("Choose Single or Double walk");
 return true;
}

const packageDays=[1,2,3,5,7,10,14,15,30] as const;
const single30=[120,230,330,525,700,950,1260,1350,1999] as const;
const double30=[200,380,540,850,1120,1600,2240,2399,3499] as const;
/** Customer-facing estimate. 45/60-minute rates are proportional estimates, not separately approved prices. */
export function getPackagePrice(kind:BookingKind,days:number,duration:WalkDuration,walksPerDay:WalksPerDay){
 validateBooking(kind,days,duration,walksPerDay);
 const index=packageDays.indexOf(days as typeof packageDays[number]);
 if(index<0)throw new Error("No published package rate for this number of days");
 const base=(walksPerDay===1?single30:double30)[index];
 return Math.round(base*duration/30*100)/100;
}

/** Capacity guard: invalid counts fail closed; limit is 10 dogs per walker. */
export function canAssignDog(currentAssignedDogs:number){
 return Number.isInteger(currentAssignedDogs)&&currentAssignedDogs>=0&&currentAssignedDogs<10;
}

export type HandoverApproval={customerConsent:"pending"|"yes"|"no";adminDecision:"pending"|"approved"|"rejected"};
/** Outside handover is allowed only after explicit customer YES and Admin approval. */
export function canCompleteHandover(approval:HandoverApproval){
 return approval.customerConsent==="yes"&&approval.adminDecision==="approved";
}
