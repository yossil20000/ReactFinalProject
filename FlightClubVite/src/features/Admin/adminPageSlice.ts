import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IndexType,IndexItem } from "../../Types/GenericTypes";



let initialState: IndexType<boolean> = {};

export const adminPageSlice = createSlice({
  name: "adminPageSlice",
  initialState,
  reducers:{
    setDirty: (state,action: PayloadAction<IndexItem<boolean>>) => {
      state[action.payload.key] = action.payload.value
    }
  }
});

export const {setDirty} = adminPageSlice.actions;
export default adminPageSlice.reducer;
