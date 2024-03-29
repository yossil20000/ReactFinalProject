import { Role } from "./IMember";

export default interface ILogin{
    email: string | undefined,
    password: string | undefined,
    username: string | undefined,
} 
export  interface IRefreshToken {
    member_id: string | undefined,
    username: string | undefined,
}

export interface ILoginResult {
    "access_token": string;
    "exp": number;
    "iat": string;
    "expDate": string;
    "message": string;
    "member": {
        _id: string;
        member_id: string;
        family_name: string;
        first_name: string;
        roles:Role[];
        email: string;
        username:string;
        image: string;
        id_number: string
    };
}

export interface IReset{
    "email": string | undefined;
    "username": string | undefined;
}
export interface IResetResult{
    "newPassword": string;
}
export interface IChangePassword{
    password: string | undefined;
    newPassword: string | undefined;
    username: string;
}
export interface IChangePasswordResults{
    newPassword: string;
}
