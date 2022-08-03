export default interface ILogin{
    email: string,
    password: string
} 

export interface ILoginResult {
    "access_token": string;
    "exp": number;
    "iat": string;
    "expDate": string;
    "message": string;
    "member": {
        "roll": string[];
        "_id": string;
        "email": string;
        "fullName": string;
    }
}

export interface IReset{
    "email": string;
}
export interface IResetResult{
    "newPassword": string;
}
