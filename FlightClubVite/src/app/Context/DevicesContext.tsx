import { createContext } from "react";
import IDevice from "../../Interfaces/API/IDevice";

export type DevicesContextType = {
  selectedItem: IDevice | null | undefined;
  setSelectedItem: React.Dispatch<React.SetStateAction<IDevice | null | undefined>>
  devices: IDevice[] | undefined;
}
export const DevicesContext = createContext<DevicesContextType | null | undefined>(null)
