import IDevice from "./IDevice"
import IMember from "./IMember"

export default interface IReservation{
    _id:string
    date_from: Date
    date_to:Date
    notification:{
        type: string
        notify: boolean
    }
    member: IMember
    device: IDevice
}
export interface IReservationDelete{
    member_id: string;
    device_id:string;
    _id:string;
}
export interface IReservationUpdate{
    date_from: Date;
    date_to:Date;
    _id:string;
}
export interface IReservationCreate{
    date_from: Date;
    date_to:Date;
    member_id: string;
    device_id:string;
}
