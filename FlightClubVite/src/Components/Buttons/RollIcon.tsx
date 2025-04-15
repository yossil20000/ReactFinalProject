import React from 'react'
import AdbIcon from '@mui/icons-material/Adb';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessIcon from '@mui/icons-material/Business';
import { Role } from "../../Interfaces/API/IMember";

export interface IRollIcon {
  roles: Role[] | null
}
function RollIcon(props: IRollIcon) {
  globalThis.CustomLogger.log("RollIcon/props")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function GetIcon():any {
    const iconsArray : React.JSX.Element[] = [];
    if(props.roles?.includes(Role.admin)){
      globalThis.CustomLogger.log("RollIcon/containe")
      iconsArray.push(<AdminPanelSettingsIcon key="admin"/>) ; 
    }
    else if(props.roles?.includes(Role.account)){
      iconsArray.push(<ManageAccountsIcon key="account"/>);
    }
    else if(props.roles?.includes(Role.desk)){
      iconsArray.push(<BusinessIcon/>)
    }
    return (iconsArray)
    props?.roles?.forEach((element) => {
    globalThis.CustomLogger.log("RollIcon/element", element)
    if(iconsArray.length > 0 ) return;
    if (element == Role.admin.toString()) 
    {
      
      iconsArray.push(<>Yossi</>) ;
      return  
    }
    else if (element == Role.account) 
    {iconsArray.push(<ManageAccountsIcon key="account"/>);}
    else if (element == Role.desk) iconsArray.push(<BusinessIcon/>)
    

  });
    /* if (props.roles?.includes(Role.admin)) {
      return (
        <ManageAccountsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
      )
    }
    else{
      return (
        <ManageAccountsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
      )
    } */
    
    if (iconsArray === undefined)
      return (<><AdbIcon/> <BusinessIcon/></>)
    return (iconsArray);


  }
  return (
    <>
      <GetIcon />
    </>

  )
}

export default RollIcon