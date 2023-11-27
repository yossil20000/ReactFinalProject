
import '../../Types/date.extensions'
import { IExportExelTable } from "../../Components/Report/Exel/ExportExelTable";
import { CanDo } from "../../Utils/owner";
import { IDateFilter } from "../IDateFilter";
import IDevice from "./IDevice"
import IMember from "./IMember"

export interface IFlightFilterDate extends IDateFilter {

}
export enum FlightStatus {
    CREATED = "CREATED",
    CLOSE = "CLOSE",
    PAYED = "PAYED"
}
interface IFlightBase {
    description: string;
    date: Date;
    hobbs_start: number
    hobbs_stop: number
    engien_start: number
    engien_stop: number
    status: FlightStatus
    reuired_hobbs: boolean
    duration: number
    timeOffset: number
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
export class CFlightBase implements IFlightBase {
    description: string;
    date: Date;
    hobbs_start: number;
    hobbs_stop: number;
    engien_start: number;
    engien_stop: number;
    status: FlightStatus;
    reuired_hobbs: boolean;
    duration: number;
    timeOffset: number;
    constructor() {
        this.date = new Date();
        this.description = "";
        this.engien_start = 0;
        this.engien_stop = 0;
        this.hobbs_start = 0;
        this.hobbs_stop = 0;
        this.status = FlightStatus.CREATED;
        this.reuired_hobbs = false;
        this.duration = 0;
        this.timeOffset = 0;

    }


    ishobbsValid(): boolean {
        if (this.hobbs_start > 0 && this.hobbs_stop > 0 && this.hobbs_stop > this.hobbs_start) {
            CustomLogger.log("Hobbs Valid")
            return true;
        }
        CustomLogger.warn("Hobbs Not Valid")
        return false;
    }
    isengienValid(): boolean {
        if (this.engien_start > 0 && this.engien_stop > 0 && this.engien_stop > this.engien_start) {
            CustomLogger.info("Engien Valid")
            return true;
        }
        CustomLogger.warn("Engien Not Valid")
        return false;
    }
    copy(obj: IFlightBase): void {
        this.date = obj.date;
        this.description = obj.description;
        this.engien_start = obj.engien_start;
        this.engien_stop = obj.engien_stop;
        this.hobbs_start = obj.hobbs_start;
        this.hobbs_stop = obj.hobbs_stop;
        this.status = obj.status;
        this.reuired_hobbs = obj.reuired_hobbs;
        this.duration = obj.duration;
        this.timeOffset = obj.timeOffset;
    }

}
export class CFlightCreate extends CFlightBase implements IFlightCreate {
    member_name: string = ""
    device_name: string = ""
    _id_device: string = ""
    _id_member: string = ""
    copy(obj: IFlightCreate): void {
        super.copy(obj as IFlightBase);
        this.member_name = obj.member_name;
        this.device_name = obj.device_name;
        this._id_device = obj._id_device;
        this._id_member = obj._id_member;

    }
}
export interface IFlightUpdateApi extends IFlightBase {
    _id: string;
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

export class CFlightToReport {
    private flights: IFlightData[] = [];
    constructor(flights : IFlightData[]){
        this.flights= flights;
        console.info("CFlightToReport/CTOR_flights",this.flights)
    }
    getFlightToExel(file: string="flightReport",sheet:string ="Flights",title:string= "Flight Reports"): IExportExelTable{
        let report : IExportExelTable = {
            file: file,
            sheet: sheet,
            title: title,
            header: [],
            body: [],
            save:false
        }
        report.header=["Index","Date","EngienStart","EngienEnd","Name","MemberId","Description"]
        report.body = this.flights.map((flight,i) => {
            console.info("CFlightToReport/flight",flight)
            return [i.toFixed(0),flight.date.getDisplayDate(),flight.engien_start.toFixed(1),flight.engien_stop.toFixed(1),flight.name,flight.member_id,flight.description]
        })
        console.info("CFlightToReport/report",report)
        return report;
    }
}
export interface IFlightDeleteApi {
    _id: string
}

export interface IFlightData  extends IFlightBase{
    _id: string; _id_member: string; name: string; description: string;
    device_id: string; date: Date; member_id: string; validOperation: CanDo;
    hobbs_start: number; hobbs_stop: number; engien_start: number; engien_stop: number; status: FlightStatus;
  }