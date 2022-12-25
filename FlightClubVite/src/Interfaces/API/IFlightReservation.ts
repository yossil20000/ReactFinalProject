import IDevice from "./IDevice"
import IMember from "./IMember"

export default interface IFlightReservation{
    _id: string
    date_from: Date
    date_to: Date
    notification:{
        type:  Notification
        notify: boolean
    },
    member: IMember
    device: IDevice
}
export interface IReservationFilterDate {
    from: Date;
    to: Date;
    currentOffset: number;
}