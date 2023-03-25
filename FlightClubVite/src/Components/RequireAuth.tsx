import { useAppSelector } from "../app/hooks";
import {useLocation,Navigate,Outlet} from 'react-router-dom'
import { ROUTES } from "../Types/Urls";
import { Role } from "../Interfaces/API/IMember";
import Unauthorize from "./Unauthorize";
import { DateTime } from "luxon";
interface IRequireAuthProps {
  roles: Role[];
}

function RequireAuth(allowedRoles : IRequireAuthProps) {
  const login = useAppSelector((state) => state.authSlice);
  const location = useLocation();
  const RenderAuth = () => {
    const currentDate = DateTime.now();
    const dateExpired = DateTime.fromJSDate(new Date(login?.expDate))
    const remain = dateExpired.toUnixInteger() - currentDate.toUnixInteger();
    console.log("RenderAuth/expiredin", currentDate,dateExpired, remain)
    
    if(login?.member !== undefined && login?.member._id !== "" && login.access_token !="") {
      if(remain  <= 0 ){
        console.log("RenderAuth/expireded/remain", remain)
        return (<Navigate to={`/${ROUTES.LOGIN}`} state={{from: location}} replace />)
      }
      const role = login.member.roles.find(role => allowedRoles?.roles.includes(role));
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