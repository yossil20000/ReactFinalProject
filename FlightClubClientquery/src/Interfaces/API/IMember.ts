import IFlight from "./IFlight"
import IFlightReservation from "./IFlightReservation"
import IMembership from "./IMembership"

export enum MemberType{
    Normal,
    Member    
}

export enum Role{
    guest,
    user,
    desk,
    account,
    admin
}

export default interface IMember{
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
    password: string
    member_type: MemberType
    role: Role
    date_of_birth: Date
    date_of_join: Date
    date_of_leave: Date
    flights: IFlight,
    flight_reserv: IFlightReservation
    membership: IMembership
}