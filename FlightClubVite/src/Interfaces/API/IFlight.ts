import IDevice from "./IDevice"
import IFlightReservation from "./IFlightReservation"

export enum Status{
    CREATED,
    OPEN,
    CLOSE
}
export default interface IFlight{
    hobbs_start: number
    hobbs_stop: number
    engien_start: number
    engien_stop: number
    status: Status
    device: IDevice
    member: IFlightReservation
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