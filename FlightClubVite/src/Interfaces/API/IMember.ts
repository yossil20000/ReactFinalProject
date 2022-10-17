import IFlight from "./IFlight"
import IFlightReservation from "./IFlightReservation"
import IMembership from "./IMembership"

export enum MemberType{
    Normal,
    Member    
}
export enum Status {
    "Active" = "Active","Suspended" = "Suspended","Removed"="Removed"
}
export enum Role{
    "guest"= 'guest',
    "user" = 'user',
    "desk" = "desk",
    "account" = 'account',
    "admin" = "admin"
}

export default interface IMember{
    _id:string
    member_id: string
    family_name: string
    first_name: string
    contact:{
        billing_address: {
            line1: string
            line2: string
            city: string
            postcode: string
            province: string
            state: String
        },
        shipping_address: {
            line2: string
            line1: string
            city:  string
            postcode: string
            province: string
            state: string
        },
        phone: {
            country:string
            area: string
            number: string
        },
        email: string
    },
    status: Status
    password: string
    username: string;
    member_type: MemberType
    role: {
        roles: Role[]
    };
    date_of_birth: Date
    date_of_join: Date
    date_of_leave: Date
    flights: IFlight,
    flight_reserv: IFlightReservation
    membership: IMembership
}