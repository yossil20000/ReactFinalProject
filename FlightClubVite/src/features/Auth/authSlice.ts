import { createSlice, PayloadAction} from '@reduxjs/toolkit'
import IAuth from '../../Interfaces/API/IAuth';
import { ILoginResult } from '../../Interfaces/API/ILogin';

const initialState : ILoginResult = {
    member: {
        roll: [],
        _id: '',
        email: '',
        fullName: ''
    },
    access_token: '',
    exp: 0,
    iat: '',
    expDate: '',
    message: ''
}
export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setCredentials: (state,action: PayloadAction<ILoginResult>) => {
            state.access_token = action.payload.access_token;
            console.log("setCredentials",action.payload , state);
        },
        logOut: (state) => {
            state = initialState
        }
    },
});


export const {setCredentials,logOut} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state : IAuth) => state.member;
export const selectCurrentToken = (state: IAuth) => state.token;
export const selectCurrentId = (state:IAuth) => state.member._id;

