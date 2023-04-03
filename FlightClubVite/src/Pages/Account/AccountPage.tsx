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
  { id: 0, label: "Flights" },
  { id: 1, label: "Orders" },
  { id: 2, label: "Expense" },
  { id: 3, label: "Transactions" },
  { id: 4, label: "Accounts" }
]

function AccountPage() {
  const [value, setValue] = useLocalStorage<number>("_accountPage", 0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    CustomLogger.log("AdminPage/newValue", newValue)
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
              {value === 4 && (<AccountsTab/>)}
              {value === 0 && (<AccountFlightsTab/>)}
              {value === 2 && (<AccountExpenseTab/>)}
              {value === 1 && (<AccountOrders/>)}
              {value === 3 && (<AccountTransactionsTab/>)}
              {value === 5 && (<AccountTest/>)}
            </Paper>
            </Box>
{/*         </MembersContext.Provider> */}
      </div>
    </>
  )
}

export default AccountPage