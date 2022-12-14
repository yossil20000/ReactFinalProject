import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LOCAL_STORAGE } from '../../Enums/localStroage';
import { ILoginResult } from '../../Interfaces/API/ILogin';
import { Role } from '../../Interfaces/API/IMember';
import { getFromLocalStorage, setLocalStorage } from '../../Utils/localStorage';
let initialState: ILoginResult = {
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
        roles: [Role.guest],
        email: "",
        username:""

    }
}
const login_info  =   getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);
if(login_info !== "")
{
    initialState = login_info as ILoginResult;
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
            setLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO, state);
        },
        logOut: (state) => {
            state.member = JSON.parse(JSON.stringify(initialState.member));
            
            state.access_token = "";
            state.message = "";
            state.exp = 0;
            state.expDate = "";
            state.iat = ""; 
            console.log("logOut", state);
            setLocalStorage<string>(LOCAL_STORAGE.LOGIN_INFO, "")
        }
    },
});


export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: ILoginResult) => state.member;
export const selectCurrentToken = (state: ILoginResult) => state.access_token;
export const selectCurrentId = (state: ILoginResult) => state.member._id;


