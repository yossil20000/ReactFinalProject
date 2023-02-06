import { Box, Paper } from "@mui/material";
import { MembersContext } from "../../app/Context/MemberContext";
import ScrollableTabs, { ScrollableTabsItem } from "../../Components/Buttons/ScrollableTabs"
import useLocalStorage from "../../hooks/useLocalStorage";
import UserAccountTab from "./UserAccountTab";
import UserOrderTab from "./UserOrder";


const items: ScrollableTabsItem[] = [
  { id: 0, label: "Orders" },
  { id: 1, label: "Account" }

]

function UserAccount() {
  const [value, setValue] = useLocalStorage<number>("_UserAccount", 0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    console.log("AdminPage/newValue", newValue)
  }
  return (
    <>
      <div className='header'>
        <ScrollableTabs items={items} value={value} setValue={setValue} handleChange={handleChange} />
      </div>
      <div className='main' style={{ overflow: 'auto', position: 'relative' }}>
        {/* <MembersContext.Provider value={{ selectedItem: selectedMember, setSelectedItem: setSelectedMember, members: members?.data }}> */}
        <Box height={"100%"} sx={{backgroundColor: "white"}}>
            <Paper style={{height: "100%"}}>
              {value === 0 && (<UserOrderTab/>)}
              {value === 1 && (<UserAccountTab/>)}
            </Paper>
            </Box>
{/*         </MembersContext.Provider> */}
      </div>
    </>
  )
}

export default UserAccount