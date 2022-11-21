import { createContext } from "react";
import IMembership from "../../Interfaces/API/IMembership";


export type MembershipContextType = {
  selectedItem: IMembership | null | undefined;
  setSelectedItem: React.Dispatch<React.SetStateAction<IMembership | null | undefined>>;
  membership: IMembership[] | null | undefined ;
}
export const MembershipContext = createContext<MembershipContextType | null | undefined>(null)
