import AdbIcon from '@mui/icons-material/Adb';
import BusinessIcon from '@mui/icons-material/Business';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { Role } from "../../Interfaces/API/IMember";

export interface IRollIcon {
  roles: Role[],
  image?: string
}
function UserIcon(props: IRollIcon) {
  CustomLogger.log("RollIcon/props", props)
  function GetIcon(): any {

    const iconsArray: JSX.Element[] = [];
    props?.roles?.forEach(element => {
      CustomLogger.info("UserIcon/element", element)
      if (element == Role.user) iconsArray.push(<AccountCircleTwoToneIcon key="account" />);
      if (element == Role.guest) iconsArray.push(<NoAccountsIcon key="no-account" />);
    });

    if (iconsArray.length == 0)
      return (<><AdbIcon /> <BusinessIcon /></>)
    return (iconsArray);
  }
  return (
    <>
      <GetIcon />
    </>

  )
}

export default UserIcon