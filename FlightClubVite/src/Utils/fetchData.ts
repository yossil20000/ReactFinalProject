import { useFetchAllDevicesQuery } from "../features/Device/deviceApiSlice";
import { apiSlice, useFetchMembersComboQuery } from "../features/Users/userSlice";
import { IDeviceCombo, IMemberCombo } from "../Interfaces/IFlightReservationProps"
import {useAppDispatch,useAppSelector} from '../app/hooks'
import {storeUser} from '../app/userStor'

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