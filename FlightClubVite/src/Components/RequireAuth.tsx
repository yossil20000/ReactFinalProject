import { useAppSelector } from "../app/hooks";
import {useLocation,Navigate,Outlet} from 'react-router-dom'
import { ROUTES } from "../Types/Urls";
import { Role } from "../Interfaces/API/IMember";
import Unauthorize from "./Unauthorize";

interface IRequireAuthProps {
  roles: Role[];
}


function RequireAuth(allowedRoles : IRequireAuthProps) {
  const login = useAppSelector((state) => state.authSlice);
  const location = useLocation();
  const RenderAuth = () => {
    console.log("RenderAuth")
    if(login?.member !== undefined && login?.member._id !== "") {
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