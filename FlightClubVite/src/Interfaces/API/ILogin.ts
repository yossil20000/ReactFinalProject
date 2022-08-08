import IMemberInfo from "../IMemberInfo";

export default interface ILogin{
    email: string | undefined,
    password: string | undefined
} 

export interface ILoginResult {
    "access_token": string;
    "exp": number;
    "iat": string;
    "expDate": string;
    "message": string;
    "member": IMemberInfo;
}

export interface IReset{
    "email": string | undefined;
}
export interface IResetResult{
    "newPassword": string;
}
export interface IChangePassword{
    currentPassword: string | undefined;
    newPassword: string | undefined;
}
