 export default interface IAuth {
    user: string | null;
    token: string | null;
    "member": {
        "roll": string [];
        "_id": string;
        "email": string;
        "fullName": string;  }
}