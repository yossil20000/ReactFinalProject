enum Rank{
    Bronze,
    Silver,
    Gold
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
    name: "Not Set"
}