
import IDevice, { IDeviceCombo } from "./IDevice"
import IMember, { IMemberCombo } from "./IMember"

export default interface IReservation {
    _id: string
    date_from: Date
    date_to: Date
    notification: {
        type: string
        notify: boolean
    }
    member: IMember
    device: IDevice
    timeOffset: number
    time_from: number
    time_to: number
}
export interface IReservationDelete {

    _id: string;
}
export interface IReservationUpdateApi {
    date_from: Date;
    date_to: Date;
    _id: string;
    timeOffset:number
    time_from: number
    time_to: number
}
export interface IReservationUpdate {

    date_from: Date;
    date_to: Date;
    _id: string;
    member_name: string;
    device_name: string;
    timeOffset:number
    time_from: number
    time_to: number

}
export class ReservationUpdate implements IReservationUpdate {
    date_from: Date;
    date_to: Date;
    _id: string;
    member_name: string;
    device_name: string;
    timeOffset:number;
    time_from: number;
    time_to: number;
    constructor() {
        this.date_from = new Date();
        this.date_to = new Date();
        this.member_name = "";
        this.device_name = "";
        this._id = ""
        this.timeOffset = this.date_from.getTimezoneOffset()
        this.time_from = this.date_from.getTime()
        this.time_to = this.date_to.getTime()
    }
    IsValid(): boolean {
        if (this.date_to > this.date_from) {
            CustomLogger.info("IsValid", true)
            return true;
        }
        CustomLogger.warn("IsValid", false)
        return false;
    }
    copy(i: IReservationUpdate): void {
        this._id = i._id;
        this.date_from = new Date(i.date_from);
        this.date_to = new Date(i.date_to);
        this.member_name = i.member_name;
        this.device_name = i.device_name;
        this.timeOffset = i.timeOffset;
        this.time_from = i.time_from;
        this.time_to = i.time_to
    }
    copyReservation(i: IReservation): void {
        this._id = i._id;
        this.date_from = new Date(i.date_from);
        this.date_to = new Date(i.date_to);
        this.member_name = i.member.family_name;
        this.device_name = i.device.device_id;
        this.timeOffset = i.timeOffset;
        this.time_from = i.time_from;
        this.time_to = i.time_to
    }
}


export interface IReservationCreate {
    date_from: Date;
    date_to: Date;
    member: IMemberCombo | undefined;
    device: IDeviceCombo | undefined;
}

export interface IReservationCreateApi {
    date_from: Date;
    date_to: Date;
    _id_member: string;
    _id_device: string;
    timeOffset:number;
    time_from: number;
    time_to: number;
}
export function GetInitReservationAdd() : IReservationCreateApi {
    let reservationAddIntitial: IReservationCreateApi = {
        date_from: new Date(),
        date_to: new Date().addHours(1),
        _id_member: "",
        _id_device: "",
        timeOffset: 0,
        time_from: 0,
        time_to: 0
      }
      reservationAddIntitial.timeOffset = reservationAddIntitial.date_from?.getTimezoneOffset()
      reservationAddIntitial.time_from = reservationAddIntitial.date_from?.getTime(),
      reservationAddIntitial.time_to =  reservationAddIntitial.date_to?.getTime()
      return reservationAddIntitial
    
} 
export function CreateReservationToApi(reservation: IReservationCreate): IReservationCreateApi {
    let reservationAddIntitial: IReservationCreateApi = {
        date_from: reservation.date_from,
        date_to: reservation.date_to,
        _id_member: reservation.member?._id ?? "",
        _id_device: reservation.device?._id ?? "",
        timeOffset: 0,
        time_from: 0,
        time_to: 0
    };
    reservationAddIntitial.timeOffset = reservationAddIntitial.date_from?.getTimezoneOffset()
    reservationAddIntitial.time_from = reservationAddIntitial.date_from?.getTime(),
    reservationAddIntitial.time_to =  reservationAddIntitial.date_to?.getTime()
    return reservationAddIntitial;
}

