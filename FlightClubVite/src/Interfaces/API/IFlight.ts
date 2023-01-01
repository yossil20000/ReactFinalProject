import { IDateFilter } from "../IDateFilter";
import IDevice from "./IDevice"
import IFlightReservation from "./IFlightReservation"
import IMember from "./IMember"

export interface IFlightFilterDate extends IDateFilter{

}
export enum Status {
    CREATED,
    OPEN,
    CLOSE
}
interface IFlightBase {

    hobbs_start: number
    hobbs_stop: number
    engien_start: number
    engien_stop: number
    status: Status
    date_from: Date;
    date_to: Date;
    description: string
}
export default interface IFlight extends IFlightBase {
    _id: string;
    device: IDevice
    member: IMember
}

export interface IFlightCreateApi extends IFlightBase {
    _id_device: string
    _id_member: string
}

export interface IFlightCreate extends IFlightCreateApi {

    member_name: string
    device_name: string
}
export class CFlightBase {
    date_from: Date;
    date_to: Date;
    hobbs_start: number;
    hobbs_stop: number;
    engien_start: number;
    engien_stop: number;
    description: string;
    constructor() {
        this.date_from = new Date();
        this.date_to = new Date();
        this.description = "";
        this.engien_start = 0;
        this.engien_stop = 0;
        this.hobbs_start = 0;
        this.hobbs_stop = 0;

    }

    isDateValid(): boolean {

        if (this.date_to > this.date_from) {
            console.log("IsValid", true)
            return true;
        }
        console.log("IsValid", false)
        return false;
    }
    ishobbsValid(): boolean {
        if (this.hobbs_start > 0 && this.hobbs_stop > 0 && this.hobbs_stop > this.hobbs_start) {
            console.log("Hobbs Valid")
            return true;
        }
        return false;
    }
    isengienValid(): boolean {
        if (this.engien_start > 0 && this.engien_stop > 0 && this.engien_stop > this.engien_start) {
            console.log("Engien Valid")
            return true;
        }
        return false;
    }
    copy(obj: IFlightBase): void {
        this.date_from = obj.date_from;
        this.date_to = obj.date_to;
        this.description = obj.description;
        this.engien_start = obj.engien_start;
        this.engien_stop = obj.engien_stop;
        this.hobbs_start = obj.hobbs_start;
        this.hobbs_stop = obj.hobbs_stop;

    }

}
export class CFlightCreate extends CFlightBase implements IFlightCreate {
    member_name: string = ""
    device_name: string = ""
    _id_device: string = ""
    _id_member: string = ""
    status: Status = 0
    copy(obj: IFlightCreate): void {
        super.copy(obj as IFlightBase);
        this.member_name = obj.member_name;
        this.device_name = obj.device_name;
        this._id_device = obj._id_device;
        this._id_member = obj._id_member;
        this.status = obj.status;
    }
}
export interface IFlightUpdateApi {
    _id: string;
    hobbs_start: number
    hobbs_stop: number
    engien_start: number
    engien_stop: number
    date_from: Date
    date_to: Date
    description: string
}
export interface IFlightUpdate extends IFlightBase {
    _id: string;
    member_name: string
    device_name: string

}

export class CFlightUpdate extends CFlightBase implements IFlightUpdate {
    _id: string = "";
    member_name: string = ""
    device_name: string = ""
    status: Status = Status.CREATED
    constructor() {
        super()
    }

    copy(obj: IFlightUpdate): void {
        super.copy(obj as IFlightBase)
        this._id = obj._id;
        this.member_name = obj.member_name;
        this.device_name = obj.device_name;
        this.status = obj.status;
    }
    
}

export interface IFlightDeleteApi {
    _id: string
}