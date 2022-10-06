import IDevice from "./IDevice"
import IFlightReservation from "./IFlightReservation"
import IMember from "./IMember"

export enum Status{
    CREATED,
    OPEN,
    CLOSE
}
export default interface IFlight{
    _id: string;
    hobbs_start: number
    hobbs_stop: number
    engien_start: number
    engien_stop: number
    status: Status
    device: IDevice
    member: IMember
    date_from: Date;
    date_to: Date;
    description: string
}

export interface IFlightCreateApi{
    hobbs_start: number
    hobbs_stop: number
    engien_start: number
    engien_stop: number
    device_id: string
    member_id: string
    date_from: Date
    date_to: Date
    description: string
}
export interface IFlightUpdateApi{
    _id: string;
    hobbs_start: number
    hobbs_stop: number
    engien_start: number
    engien_stop: number
    date_from: Date
    date_to: Date
    description: string
}
export interface IFlightUpdate{
    _id: string;
    hobbs_start: number
    hobbs_stop: number
    engien_start: number
    engien_stop: number
    date_from: Date
    date_to: Date
    description: string
    member_name: string
    device_name: string
}

export class FlightUpdate implements IFlightUpdate {
    _id: string;
    date_from: Date;
    date_to: Date;
    member_name: string;
    device_name: string;
    hobbs_start: number;
    hobbs_stop: number;
    engien_start: number;
    engien_stop: number;
    description: string;
    constructor(){
        this.date_from = new Date();
        this.date_to = new Date();
        this.member_name = "";
        this.device_name = "";
        this._id ="";
        this.description ="";
        this.engien_start=0;
        this.engien_stop=0;
        this.hobbs_start=0;
        this.hobbs_stop=0;

    }

    IsDateValid(): boolean {
        
        if(this.date_to > this.date_from)
            {
                console.log("IsValid", true)
                return true;
            }
            console.log("IsValid", false)
        return false;
    }
    ishoobsValid(): boolean {
        if(this.hobbs_start > 0 && this.hobbs_stop > 0 && this.hobbs_stop > this.hobbs_start){
            console.log("Hobbs     Valid")
            return true;
        }
        return false;
    }
    isengienValid(): boolean {
        if(this.engien_start > 0 && this.engien_stop > 0 && this.engien_stop > this.engien_start){
            console.log("Engien Valid")
            return true;
        }
        return false;
    }
    copy(i : IFlightUpdate) :void {
        this.date_from = i.date_from;
        this.date_to = i.date_to;
        this.member_name = i.member_name;
        this.device_name = i.device_name;
        
    }
}

export interface IFlightDeleteApi{
    _id: string
}