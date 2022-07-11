import IDevice from "./IDevice"
import IMember from "./IMember"

export default interface IReservation{
    date_from: Date
    date_to:Date
    notification:{
        type: string
        notify: boolean
    }
    member: IMember
    device: IDevice
}