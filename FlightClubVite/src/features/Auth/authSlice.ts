import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import IAuth from '../../Interfaces/API/IAuth';
import { ILoginResult } from '../../Interfaces/API/ILogin';
import IMemberInfo from '../../Interfaces/IMemberInfo';

const initialState: ILoginResult = {
    access_token: '',
    exp: 0,
    iat: '',
    expDate: '',
    message: '',
    member: {
        _id: "",
        member_id: "",
        family_name: "",
        first_name: "",
        contact: {
            billing_address: {
                line1: "",
                line2: "",
                city: "",
                postcode: "",
                province: "",
                state: "",
            },
            shipping_address: {
                line2: "",
                line1: "",
                city: "",
                postcode: "",
                province: "",
                state: "",
            },
            phone: {
                country: "",
                area: "",
                number: "",
            },
            email: "",
        },
        date_of_birth: undefined,
        password: ""
    }
}
export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setCredentials: (state: ILoginResult, action: PayloadAction<ILoginResult>) => {
            state.member = action.payload.member;
            state.access_token = action.payload.access_token;
            state.message = action.payload.message;
            state.exp = action.payload.exp;
            state.expDate = action.payload.expDate;
            state.iat = action.payload.iat;
            console.log("setCredentials/action.payload", action.payload);
            console.log("setCredentials/state", state);
        },
        logOut: (state) => {
            state.member = JSON.parse(JSON.stringify(initialState.member)) as IMemberInfo;
            
            state.access_token = "";
            state.message = "";
            state.exp = 0;
            state.expDate = "";
            state.iat = ""; 
            console.log("logOut", state);
        }
    },
});


export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: ILoginResult) => state.member;
export const selectCurrentToken = (state: ILoginResult) => state.access_token;
export const selectCurrentId = (state: ILoginResult) => state.member._id;

