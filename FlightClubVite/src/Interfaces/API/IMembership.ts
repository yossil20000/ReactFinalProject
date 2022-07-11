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