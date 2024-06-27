import { FuelUnits } from "../../Types/FuelUnits"
import IDeviceType from "./IDeviceType"
import '../../Types/date.extensions';
import { IFilter } from "./IFilter"
import IFlight, { FlightStatus } from "./IFlight"
import IFlightReservation from "./IFlightReservation"
import IMember, { IMemberCombo } from "./IMember"
import { Status } from "./IStatus"
import { IExportExelTable } from "../../Components/Report/Exel/ExportExelTable";



export interface IDeviceComboFilter extends IFilter {
    filter?: {
        status: Status
    },
    select?: string,
    find_select?: {
        _id: string;
        device_id: number;
        engien_meter: number;
        maintanance: number;
    }
}
export enum DEVICE_STATUS {
    IN_SERVICE,
    OUT_OFSERVICE,
    MAINTANANCE,
    NOT_EXIST
}
export enum DEVICE_MT {
    "50hr" = "50hr",
    "100hr" = "100hr",
    "200hr" = "200hr"
}

export enum DEVICE_SERVICE {
    "50hr" = "50hr",
    "100hr" = "100hr",
    "200hr" = "200hr",
    "Annual" = 'Annual'
}

export enum DEVICE_MET {
    HOBBS = "HOBBS",
    ENGIEN = "ENGIEN"
}
export enum DEVICE_INS {
    VFR = '#7057ff',
    IFR = '#008672',
    G1000 = '#b60205',
    ICE = '#d93f0b',
    AIR_CONDITION = '#0e8a16'
}
export type Maintanance = {
    type: DEVICE_MT
    next_meter: number
}
export type Services = {
    _id: string
    date: Date,
    engien_meter: number,
    type: string,
    description: string
}
interface IDeviceBase {

    device_id: string
    device_type: (IDeviceType | string)
    description: string
    available: boolean
    device_status: DEVICE_STATUS
    hobbs_meter: number
    engien_meter: number
    engien_start_meter: number
    due_date: Date
    maintanance: {
        type: DEVICE_MT
        next_meter: number,
        services: [
            Services
        ]
    },
    price: {
        base: number
        meter: DEVICE_MET
    },
    details: {
        image: string
        color: string
        seats: number
        fuel: {
            quantity: number
            units: FuelUnits
        }
        instruments: DEVICE_INS[]
    }
    location_zone: string
    status: Status
    has_hobbs: boolean
}

export interface IDeviceCreate extends IDeviceBase {

    can_reservs: IMember[]
    flights: IFlight[]
    flight_reservs: IFlightReservation[]

}


export interface IDeviceAdminUpdate extends IDeviceBase {
    _id: string
    can_reservs: IMember[]
}

export default interface IDevice extends IDeviceBase {
    _id: string
    can_reservs: IMember[]
    flights: IFlight[]
    flight_reservs: IFlightReservation[]

}
export interface IDeviceCombo {
    _id: string;
    device_id: string;
    engien_meter: number;
    available: boolean;
    maintanance: Maintanance;
    can_reservs: IMemberCombo[]
    has_hobbs: boolean;
}
export interface IDeviceCanReserve {
    can_reservs: IMemberCombo[]
}

export interface IDeviceReport {
    _id: string;
    description: string;
    date: Date;
    hobbs_start: number
    hobbs_stop: number
    engien_start: number
    engien_stop: number
    status: FlightStatus;
    reuired_hobbs: boolean;
    duration: number;
    device: {
        _id: string;
        device_id: string;
        available: boolean;
        device_status: DEVICE_STATUS;
        engien_meter: number
        engien_start_meter:number
        due_date: Date
        maintanance: {
            type: DEVICE_MT
            next_meter: number,
            services: [
                Services
            ]
        };
        status: Status;
    }
    member: {
        _id: string;
        member_id: string;
        family_name: string;
        first_name: string;
    }
}

export class CServicesToReport {
    private device: IDevice;
    constructor(device: IDevice) {
        this.device = device;
        console.info("CServicesToReport/CTOR_device", this.device)
    }
    getServicesToExel(file: string = "serviceReport", sheet: string = "Services", title: string = "Services Reports"): IExportExelTable {
        let report: IExportExelTable = {
            file: file,
            sheet: sheet,
            title: title,
            header: [],
            body: [],
            save: false
        }
        report.header = ["Index", "Date", "Engine Meter", "Type", "Description"]
        report.body = this.device.maintanance.services.map((service, i) => {
            console.info("CServicesToReport/service", service)
            return [i.toFixed(0), service.date.getDisplayDate(), service.engien_meter.toFixed(1), service.type, service.description]
        })
        console.info("CServicesToReport/report", report)
        return report;
    }
}