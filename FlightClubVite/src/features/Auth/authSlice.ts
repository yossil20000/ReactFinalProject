//https://blog.logrocket.com/handling-user-authentication-redux-toolkit/
import { createSlice } from "@reduxjs/toolkit";

export interface userLogin{

}
const initialState ={
    loading:  false,
    userInfo: {},
    userToken: null,
    error: null,
    success: false
}

const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{},
    extraReducers: {},
})

export default authSlice.reducer;