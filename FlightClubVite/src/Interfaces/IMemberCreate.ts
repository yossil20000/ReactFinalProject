import { Role } from "./API/IMember";
import IMemberUpdate from "./IMemberInfo";

export default interface IMemberCreate extends IMemberUpdate {
    username?: string
    password?: string
    role?: {
        roles: Role[]
    };
}