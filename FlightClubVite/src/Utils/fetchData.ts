import { apiSlice } from "../features/Users/userSlice";
import {storeUser} from '../app/userStor'
import { IDeviceCombo } from "../Interfaces/API/IDevice";
import { IMemberCombo } from "../Interfaces/API/IMember";

export interface IDevicesMembers {
  memberscombo: IMemberCombo[];
  devicesCombo: IDeviceCombo[];
}
export const getMembersAndDevicesCombo = async () : Promise<IDevicesMembers> => {
  let result : IDevicesMembers= {
    memberscombo: [],
    devicesCombo: []
  }
try{
  const aaaa =  (await storeUser.dispatch(apiSlice.endpoints.fetchMembersCombo.initiate())).data?.data;

   result = {
    memberscombo: aaaa === undefined ? [] : aaaa as IMemberCombo[],
    devicesCombo: []
  }
  console.log("getMembersAndDevicesCombo", result)
  return result;
}
catch(error)
{
  console.log("getMembersAndDevicesCombo/error", error)
}
return result;
 
}