import { useAppSelector } from "../app/hooks";
import { Role } from "../Interfaces/API/IMember";

export enum CanDo {
  None = 0,
  Read = 1,
  Edit = 2,
  Delete =4,
  Owner = 8 
}
 export default function  GeneralCanDo(id: string, login_id: string, role: Role[]) : CanDo  {
  let canDo = CanDo.None;
  try{
    
    if(login_id === id) {canDo = CanDo.Read  | CanDo.Edit | CanDo.Delete | CanDo.Owner; return canDo;}
    if(role.includes(Role.admin)) {canDo =  CanDo.Edit | CanDo.Read | CanDo.Delete ; return canDo};
    if(role.includes(Role.account)) {canDo =  CanDo.Edit | CanDo.Read ; return canDo};
    if(role.includes(Role.desk)) {canDo =  CanDo.Edit | CanDo.Read ; return canDo};
    return canDo;
  }
  catch(err){
    return canDo;
  }
  
}