import { Box, Paper } from "@mui/material";
import { MembersContext } from "../../app/Context/MemberContext";
import ScrollableTabs, { ScrollableTabsItem } from "../../Components/Buttons/ScrollableTabs"
import useLocalStorage from "../../hooks/useLocalStorage";
import AccountExpenseTab from "./AccountExpenseTab";
import AccountFlightsTab from "./AccountFlightsTab";
import AccountOrders from "./AccountOrdersTab";
import AccountsTab from "./AccountsTab";
import AccountTest from "./AccountTest";
import AccountTransactionsTab from "./AccountTransactionsTab";
import OrdersTab from "./OrdersTab";

const items: ScrollableTabsItem[] = [
  { id: 0, label: "Accounts" },
  { id: 1, label: "Flights" },
  { id: 2, label: "Expense" },
  { id: 3, label: "Orders" },
  { id: 4, label: "Transactions" }

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
      <div className='main' style={{ overflow: 'auto', position: 'relative' ,height: '100%'}}>
        {/* <MembersContext.Provider value={{ selectedItem: selectedMember, setSelectedItem: setSelectedMember, members: members?.data }}> */}
        <Box height={"100%"} sx={{backgroundColor: "white"}}>
            <Paper style={{height: "100%"}}>
              {value === 0 && (<AccountsTab/>)}
              {value === 1 && (<AccountFlightsTab/>)}
              {value === 2 && (<AccountExpenseTab/>)}
              {value === 3 && (<AccountOrders/>)}
              {value === 4 && (<AccountTransactionsTab/>)}
              {value === 5 && (<AccountTest/>)}
            </Paper>
            </Box>
{/*         </MembersContext.Provider> */}
      </div>
    </>
  )
}

export default AccountPage