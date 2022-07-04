import axios from "axios";
import ILogin from "../../../Interfaces/API/ILogin";
import {URLS} from "../../../Types/Urls"
const apiclient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_ADDRESS,
    headers:{
        "Content-type": "application/json",
    }
});
const login = async ({email,password} : ILogin) => {
    const response = await apiclient.put(
        `${URLS.SERVER_BASE_ADDRESS}/login`,
        {
            "email": email,
            "password": password
        }
        )
    console.log("Login Axios" , response.data)
    return response.data;
}
const AuthService = {
    login
  }
export default AuthService;
