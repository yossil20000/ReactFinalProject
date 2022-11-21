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
export default interface IMembership{
    entry_price: number
    montly_price: number
    hour_disc_percet: number
    rank: Rank
    status: Status
}

export const  NewMembership : IMembership = {
    entry_price: 0,
    montly_price: 0,
    hour_disc_percet: 0,
    rank: Rank.Bronze,
    status: Status.Created
}