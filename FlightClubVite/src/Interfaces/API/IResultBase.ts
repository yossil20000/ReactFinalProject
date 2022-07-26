export default interface IResultBase<T> {
    "success": boolean;
    "errors": string[];
    "data": T[];
}

export  interface IResultBaseSingle<T> {
    "success": boolean;
    "errors": string[];
    "data": T;
}