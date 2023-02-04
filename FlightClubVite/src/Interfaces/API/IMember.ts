import { IFilter } from "./IFilter"
import IFlight from "./IFlight"
import IFlightReservation from "./IFlightReservation"
import IMembership from "./IMembership"
export interface IMemberComboFilter extends IFilter{
    filter?:{
        status: Status
    }
}
export enum Gender {
    "male" = "male",
    "female" = "female",
    "other" = "other"
}
export enum MemberType{
    Supplier ="Supplier",
    Member  = "Member"  
}
export enum Status {
    "Active" = "Active","Suspended" = "Suspended","Removed"="Removed"
}
export enum Role{
    "supplier"= 'supplier',
    "guest"= 'guest',
    "user" = 'user',
    "desk" = "desk",
    "account" = 'account',
    "admin" = "admin"
}
export interface IMemberBase {
    member_id: string
    family_name: string
    first_name: string
    image: string,
    gender: Gender,
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
        email: string,
    }
}

export interface IMemberAdmin  extends IMemberBase{
    _id:string
    status: Status
    member_type: MemberType
    role: {
        roles: Role[]
    };
    date_of_birth: Date
    date_of_join: Date
    date_of_leave: Date | null
    membership: IMembership
    username: string;
}
export default interface IMember  extends IMemberBase{
    _id:string
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
    membership: IMembership
    flights: IFlight,
    flight_reserv: IFlightReservation

}
export interface IMemberCombo{
    _id:string;
    member_id: string;
    family_name: string;
    first_name: string;
  }

  export interface IMemberStatus {
    _id: string
    status: Status
  }