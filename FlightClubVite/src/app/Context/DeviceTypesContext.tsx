import { createContext } from "react";
import IDeviceType from "../../Interfaces/API/IDeviceType";

export type DeviceTypesContextType = {
  selectedItem: IDeviceType | null | undefined;
  setSelectedItem: React.Dispatch<React.SetStateAction<IDeviceType | null | undefined>>
  deviceTypes: IDeviceType[] | undefined;
}
export const DeviceTypesContext = createContext<DeviceTypesContextType | null | undefined>(null)
