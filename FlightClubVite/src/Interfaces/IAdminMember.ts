import { IMemberBase, MemberType, Role, Status } from "./API/IMember";
import IMembership from "./API/IMembership";

export default interface IAdminMember extends  IMemberBase {
  _id:string
  status: Status
  username: string;
  member_type: MemberType
  role: {
      roles: Role[]
  };
  date_of_birth: Date
  date_of_join: Date
  date_of_leave: Date
  membership: IMembership
}