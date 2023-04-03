import { Box, Paper } from "@mui/material";
import ScrollableTabs, { ScrollableTabsItem } from "../../Components/Buttons/ScrollableTabs"
import useLocalStorage from "../../hooks/useLocalStorage";
import UserAccountTab from "./UserAccountTab";
import UserOrderTab from "./UserOrderTab";

const items: ScrollableTabsItem[] = [
  { id: 0, label: "Orders" },
  { id: 1, label: "Account" }
]

function UserAccount() {
  const [value, setValue] = useLocalStorage<number>("_UserAccount", 0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    CustomLogger.info("AdminPage/newValue", newValue)
  }
  return (
    <>
      <div className='header'>
        <ScrollableTabs items={items} value={value} setValue={setValue} handleChange={handleChange} />
      </div>
      <div className='main' style={{ overflow: 'auto', position: 'relative', height: '100%' }}>
        {/* <MembersContext.Provider value={{ selectedItem: selectedMember, setSelectedItem: setSelectedMember, members: members?.data }}> */}
        <Box height={"100%"} sx={{ backgroundColor: "white" }}>
          <Paper style={{ height: "100%" }}>
            {value === 0 && (<UserOrderTab />)}
            {value === 1 && (<UserAccountTab />)}
          </Paper>
        </Box>
        {/*         </MembersContext.Provider> */}
      </div>
    </>
  )
}

export default UserAccount