import { Box, Paper } from "@mui/material";
import { MembersContext } from "../../app/Context/MemberContext";
import ScrollableTabs, { ScrollableTabsItem } from "../../Components/Buttons/ScrollableTabs"
import useLocalStorage from "../../hooks/useLocalStorage";
import AccountFlightsTab from "./AccountFlightsTab";
import AccountOrders from "./AccountOrdersTab";
import AccountsTab from "./AccountsTab";
import AccountTest from "./AccountTest";
import OrdersTab from "./OrdersTab";

const items: ScrollableTabsItem[] = [
  { id: 0, label: "Accounts" },
  { id: 1, label: "Flights" },
  { id: 2, label: "Orders" },
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
              {value === 0 && (<AccountsTab/>)}
              {value === 1 && (<AccountFlightsTab/>)}
              {value === 2 && (<AccountOrders/>)}
              {value === 3 && (<OrdersTab/>)}
              {value === 4 && (<AccountTest/>)}
            </Paper>
            </Box>
{/*         </MembersContext.Provider> */}
      </div>
    </>
  )
}

export default AccountPage