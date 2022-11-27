enum Rank{
    Bronze,
    Silver,
    Gold
}

enum Status {
    Created,
    Active,
    Susspende
}
export interface IMembershipCombo {
    _id: string;
    name: string;
    rank: Rank;
}
export  interface IMembershipBase{
    
    entry_price: number
    montly_price: number
    hour_disc_percet: number
    rank: Rank
    status: Status
    name:string
}
export default interface IMembership extends IMembershipBase{
    _id: string
}

export const  NewMembership : IMembership = {
    _id: "",
    entry_price: 0,
    montly_price: 0,
    hour_disc_percet: 0,
    rank: Rank.Bronze,
    status: Status.Created,
    name: "Not Set"
}