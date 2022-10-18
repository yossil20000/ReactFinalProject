import { useAppDispatch, useAppSelector } from "../app/hooks";
import {useLocation,Navigate,Outlet} from 'react-router-dom'
import { ROUTES } from "../Types/Urls";
import { Role } from "../Interfaces/API/IMember";
import Unauthorize from "./Unauthorize";
import { useEffect } from "react";
import { LOCAL_STORAGE } from "../Enums/localStroage";
import { setCredentials } from "../features/Auth/authSlice";
import { ILoginResult } from "../Interfaces/API/ILogin";
import { getFromLocalStorage } from "../Utils/localStorage";

interface IRequireAuthProps {
  roles: Role[];
}


function RequireAuth(allowedRoles : IRequireAuthProps) {
  const login = useAppSelector((state) => state.authSlice);
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const RenderAuth = () => {
    console.log("RenderAuth",login)
    
    if(login?.member !== undefined && login?.member._id !== "") {
      const role = login.member.roles.find(role => allowedRoles?.roles.includes(role));
      if(role)
        return (<Outlet/>)
      else
        return (<Unauthorize/>)
    }
    else if(login?.member === undefined || login?.member._id == "") {
      let login = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);
      console.log("RenderAuth/logininfo",login)
      if (login === "") {
        login = {
            "access_token": "",
            "exp": 0,
            "iat": "",
            "expDate": "",
            "message": "",
            "member": {
                _id: "",
                member_id: "",
                family_name: "guset",
                first_name: "user",
                roles: [Role.guest],
                email: ""
            }
        }
        dispatch(setCredentials(login as ILoginResult));
    }
    
    console.log("RenderAuth/aftersetCredentials",login)
    const role = (login as ILoginResult).member.roles.find(role => allowedRoles?.roles.includes(role));
      if(role)
        return (<Outlet/>)
      else
        return (<Unauthorize/>)
    }
    return (<Navigate to={`/${ROUTES.LOGIN}`} state={{from: location}} replace />)
  }
  return (
   <RenderAuth/>
  )
}

export default RequireAuth