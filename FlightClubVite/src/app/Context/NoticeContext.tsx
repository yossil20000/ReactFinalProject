import { createContext } from "react";
import IClubNotice from "../../Interfaces/API/IClubNotice";


export type NoticeContextType = {
  selectedItem: IClubNotice | null | undefined;
  setSelectedItem: React.Dispatch<React.SetStateAction<IClubNotice | null | undefined >>
  notices: IClubNotice[] | [];
  
}
export const NoticeContext = createContext<NoticeContextType | null | undefined>(null)
