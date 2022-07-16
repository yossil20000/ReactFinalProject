export default interface IResultBase<T> {
    "success": boolean;
    "errors": string[];
    "data": T[];
}