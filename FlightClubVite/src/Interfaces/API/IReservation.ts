
import IDevice, { IDeviceCombo } from "./IDevice"
import IMember, { IMemberCombo } from "./IMember"

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
export interface IReservationUpdateApi{
    date_from: Date;
    date_to: Date;
    _id: string;
}
export interface IReservationUpdate{
    
    date_from: Date;
    date_to: Date;
    _id: string;
    member_name: string;
    device_name: string;
    

}
export class ReservationUpdate implements IReservationUpdate {
    date_from: Date;
    date_to: Date;
    _id: string;
    member_name: string;
    device_name: string;
    constructor(){
        this.date_from = new Date();
        this.date_to = new Date();
        this.member_name = "";
        this.device_name = "";
        this._id =""
    }
    IsValid(): boolean {
        if(this.date_to > this.date_from)
            {
                console.log("IsValid", true)
                return true;
            }
            console.log("IsValid", false)
        return false;
    }
    copy(i : IReservationUpdate) :void {
        this.date_from = i.date_from;
        this.date_to = i.date_to;
        this.member_name = i.member_name;
        this.device_name = i.device_name;
    }
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
    _id_member: string;
    _id_device:string;
}

export function CreateReservationToApi (reservation : IReservationCreate) : IReservationCreateApi  {
 let reservationApi : IReservationCreateApi = {
     date_from: reservation.date_from,
     date_to: reservation.date_to,
     _id_member: reservation.member?._id ?? "",
     _id_device: reservation.device?._id ?? ""
 };
 
 return reservationApi;
}

