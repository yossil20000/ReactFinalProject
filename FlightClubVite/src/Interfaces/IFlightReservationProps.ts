import { IDeviceCombo } from "./API/IDevice";
import { IMemberCombo } from "./API/IMember";


export interface IFlightReservationProps {
  devices: IDeviceCombo[] | [];
  members: IMemberCombo[] | [];
}
