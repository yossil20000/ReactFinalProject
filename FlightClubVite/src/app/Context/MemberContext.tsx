import { createContext } from "react";
import { IMemberAdmin } from "../../Interfaces/API/IMember";


export type MembersContextType = {
  selectedItem: IMemberAdmin | null | undefined;
  setSelectedItem: React.Dispatch<React.SetStateAction<IMemberAdmin | null | undefined>>;
  members: IMemberAdmin[] | undefined;
}
export const MembersContext = createContext<MembersContextType | null | undefined>(null)
