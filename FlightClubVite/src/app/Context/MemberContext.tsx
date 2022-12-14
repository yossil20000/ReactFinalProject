import { createContext } from "react";
import { IMemberAdmin } from "../../Interfaces/API/IMember";


export type MembersContextType = {
  selectedItem: IMemberAdmin | null | undefined;
  setSelectedItem: React.Dispatch<React.SetStateAction<IMemberAdmin | null>>;
  members: IMemberAdmin[] | undefined;
}
export const MembersContext = createContext<MembersContextType | null >(null)
