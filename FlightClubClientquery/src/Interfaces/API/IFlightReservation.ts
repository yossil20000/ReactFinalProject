import IDevice from "./IDevice"
import IMember from "./IMember"

export default interface IFlightReservation{
    date_from: Date
    date_to: Date
    notification:{
        type:  Notification
        notify: boolean
    },
    member: IMember
    device: IDevice
}