import { createContext } from "react";
import IDevice from "../../Interfaces/API/IDevice";
import { IMemberCombo } from "../../Interfaces/IFlightReservationProps";

export type DevicesContextType = {
  selectedItem: IDevice | null | undefined;
  setSelectedItem: React.Dispatch<React.SetStateAction<IDevice | null | undefined>>
  devices: IDevice[] | undefined;
  membersCombo: IMemberCombo[] | undefined;
}
export const DevicesContext = createContext<DevicesContextType | null | undefined>(null)
