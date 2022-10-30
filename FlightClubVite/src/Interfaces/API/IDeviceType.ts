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
}