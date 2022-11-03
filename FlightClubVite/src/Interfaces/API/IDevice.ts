import { FuelUnits } from "../../Types/FuelUnits"
import IDeviceType from "./IDeviceType"
import IFlight from "./IFlight"
import IFlightReservation from "./IFlightReservation"
import IMember from "./IMember"
export enum DEVICE_STATUS  {
    IN_SERVICE,
    OUT_OFSERVICE,
    MAINTANANCE,
    NOT_EXIST
}
export enum DEVICE_MT{
    hr50,
    hr100,
    Annual
}
export enum DEVICE_MET  {
    HOBBS,
    ENGIEN
}
export enum DEVICE_INS  {
    VFR='#7057ff',
    IFR = '#008672',
    G1000 ='#b60205',
    ICE = '#d93f0b',
    AIR_CONDITION = '#0e8a16'
}
export default interface IDevice{
    _id: string
    device_id: string
    device_type: (IDeviceType | string)
    description: string
    available: boolean
    device_status: DEVICE_STATUS
    due_date: Date
    hobbs_meter: number
    engien_meter: number
    maintanance: {
        type : DEVICE_MT
        next_meter: number
    },
    price:{
        base: number
        meter: DEVICE_MET
    },
    details:{
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
    can_reservs:IMember[]
    flights: IFlight[]
    flight_reservs: IFlightReservation[]

}