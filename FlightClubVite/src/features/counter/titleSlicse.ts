import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface TitleState {
    title: string;
    iconn:string;
}

const initialState : TitleState = {
    title: "Yossi",
    iconn: "Icon1"
}

const titleSlice = createSlice({
    name:'title',initialState,
    reducers:{
        setTitle(state,action: PayloadAction<string>){
            state.title = action.payload;
        },
        addTitle(state,action: PayloadAction<string>){
            state.title = `${state.title} ${action.payload}`;
        }     
    }
});

export const {addTitle, setTitle} = titleSlice.actions;
export default titleSlice.reducer;
