import { IDeviceCombo, IMemberCombo } from "../IFlightReservationProps"
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

    _id:string;
}
export interface IReservationUpdate{
    date_from: Date;
    date_to:Date;
    _id:string;
}
export interface IReservationCreate{
    date_from: Date | undefined;
    date_to:Date;
    member: IMemberCombo | undefined;
    device:IDeviceCombo | undefined;
}

export interface IReservationCreateApi{
    date_from: Date | undefined;
    date_to:Date;
    member_id: string;
    device_id:string;
}

export function CreateReservationToApi (reservation : IReservationCreate) : IReservationCreateApi  {
 let reservationApi : IReservationCreateApi = {
     date_from: reservation.date_from,
     date_to: reservation.date_to,
     member_id: reservation.member?._id ?? "",
     device_id: reservation.device?._id ?? ""
 };
 
 return reservationApi;
}

