import { createSlice, PayloadAction} from '@reduxjs/toolkit'
import IAuth from '../../Interfaces/API/IAuth';

const initialState : IAuth = {
    user: null,
    token: null
}
export const authSlice = createSlice({
    name: "authSlice1",
    initialState,
    reducers: {
        setCredentials: (state,action: PayloadAction<IAuth>) => {
            
            state.user = action.payload.user
            state.token = action.payload.token
        },
        logOut: (state) => {
            state.user = null
            state.token = null
        }
    },
});


export const {setCredentials,logOut} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state : IAuth) => state.user;
export const selectCurrentToken = (state: IAuth) => state.token;

