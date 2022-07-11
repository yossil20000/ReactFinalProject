export enum EngienType{
    SingleEngien,
    Multiengien
}
export enum SurfaceType{
    Land,
    Sea
}
export default interface IDeviceType {
    name: string
    category: string
    class:
    {
        engien: EngienType
        surface: SurfaceType
    }
    ,
    description: string
}