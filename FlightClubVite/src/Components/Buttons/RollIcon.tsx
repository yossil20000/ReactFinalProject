import React from 'react'
import AdbIcon from '@mui/icons-material/Adb';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessIcon from '@mui/icons-material/Business';
import { Role } from "../../Interfaces/API/IMember";

export interface IRollIcon {
  roles: Role[] | null
}
function RollIcon(props: IRollIcon) {
  console.log("RollIcon/props", props)
  function GetIcon():any {
   /*  const icons = props?.roles?.map(element => {
      console.log("RollIcon/element", element)
      if (element == Role.admin.toString()) return <AdminPanelSettingsIcon/>;
      if (element == Role.account) return (<ManageAccountsIcon/>);
      if (element == Role.desk) return (<BusinessIcon/>)
      return (<></>)

    }); */
    const iconsArray : JSX.Element[] = [];
    props?.roles?.forEach((element) => {
    console.log("RollIcon/element", element)
    if (element == Role.admin.toString()) iconsArray.push(<AdminPanelSettingsIcon key="admin"/>) ;
    if (element == Role.account) iconsArray.push(<ManageAccountsIcon key="account"/>);
    if (element == Role.desk) iconsArray.push(<BusinessIcon/>)
    

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