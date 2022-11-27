import { Status } from "./IStatus";

export enum EngienType{
    SingleEngien,
    Multiengien
}
export enum SurfaceType{
    Land,
    Sea
}
export enum CategoryType {
    Airplane,Rotorcraft,FDT
}
export default interface IDeviceType {
    _id: string;
    name: string
    category: CategoryType
    class:
    {
        engien: EngienType
        surface: SurfaceType
    }
    ,
    description: string
    status: Status
}

export const newDeviceType : IDeviceType = {
    _id: "",
    name: "",
    category: CategoryType.Airplane,
    class: {
        engien: EngienType.SingleEngien,
        surface: SurfaceType.Land
    },
    description: "",
    status: Status.Suspended
}