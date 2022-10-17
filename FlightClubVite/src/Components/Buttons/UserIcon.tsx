import React from 'react'
import AdbIcon from '@mui/icons-material/Adb';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessIcon from '@mui/icons-material/Business';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { Role } from "../../Interfaces/API/IMember";

export interface IRollIcon {
  roles: Role[] | null
}
function UserIcon(props: IRollIcon) {
  console.log("RollIcon/props", props)
  function GetIcon():any {
   
    const iconsArray : JSX.Element[] = [];
    props?.roles?.forEach(element => {
    console.log("RollIcon/element", element)
    if (element == Role.user) iconsArray.push(<AccountCircleTwoToneIcon/>) ;
    if (element == Role.guest) iconsArray.push(<NoAccountsIcon/>);
    

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

export default UserIcon