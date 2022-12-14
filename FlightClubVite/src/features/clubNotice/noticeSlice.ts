import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IClubNotice, { NewNotice } from "../../Interfaces/API/IClubNotice";

let initialState : IClubNotice = NewNotice;

export const noticeSlice = createSlice({
  name: "noticeSlice",
  initialState,
  reducers: {
    setNotice: (state: IClubNotice, action: PayloadAction<IClubNotice>) => {
      
      return {...action.payload};
    },
    setNoticeValue: (state: IClubNotice, action : PayloadAction<{key:string, value:any}>) => {
      return {...state,[action.payload.key] : action.payload.value}
    }

  }
});

export const {setNotice,setNoticeValue} = noticeSlice.actions;
export default noticeSlice.reducer;
