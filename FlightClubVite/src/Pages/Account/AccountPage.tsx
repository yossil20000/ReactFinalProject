import { Box, Paper } from "@mui/material";
import { MembersContext } from "../../app/Context/MemberContext";
import ScrollableTabs, { ScrollableTabsItem } from "../../Components/Buttons/ScrollableTabs"
import useLocalStorage from "../../hooks/useLocalStorage";
import AccountFlights from "./AccountFlights";
import Accounts from "./Accounts";
import AccountTest from "./AccountTest";

const items: ScrollableTabsItem[] = [
  { id: 0, label: "Accounts" },
  { id: 1, label: "1" },
  { id: 2, label: "2" },
  { id: 3, label: "3" },
  { id: 4, label: "4" }

]

function AccountPage() {
  const [value, setValue] = useLocalStorage<number>("_accountPage", 0);
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
              {value === 0 && (<Accounts/>)}
              {value === 1 && (<AccountTest/>)}
              {value === 2 && (<AccountFlights/>)}
              {value === 3 && (<>3</>)}
              {value === 4 && (<>4</>)}
            </Paper>
            </Box>
{/*         </MembersContext.Provider> */}
      </div>
    </>
  )
}

export default AccountPage