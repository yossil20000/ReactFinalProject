import { Box, Paper } from "@mui/material";
import ScrollableTabs, { ScrollableTabsItem } from "../../Components/Buttons/ScrollableTabs"
import useSessionStorage from "../../hooks/useLocalStorage";
import AccountExpenseTab from "./AccountExpenseTab";
import AccountFlightsTab from "./AccountFlightsTab";
import AccountOrders from "./AccountOrdersTab";
import AccountsTab from "./AccountsTab";
import AccountTransactionsTab from "./AccountTransactionsTab";
import AccountReportsTab from "./AccountReportsTab";
import AccountStatisticTab from "./AccountStatisticTab";

const items: ScrollableTabsItem[] = [
  { id: 0, label: "Member Flights" },
  { id: 1, label: "Member Orders" },
  { id: 2, label: "Club Expense" },
  { id: 3, label: "Transactions" },
  { id: 4, label: "Report" },
  { id: 4, label: "Statistic" },
  { id: 6, label: "Accounts" },
 /*  { id: 5, label: "ExpenseGrid" } */
]

function AccountPage() {
  const [value, setValue] = useSessionStorage<number>("_accountPage", 0);
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
              {value === 6 && (<AccountsTab/>)}
              {value === 0 && (<AccountFlightsTab/>)}
              {value === 2 && (<AccountExpenseTab/>)}
              {value === 1 && (<AccountOrders/>)}
              {value === 3 && (<AccountTransactionsTab/>)}
              {value === 4 && (<AccountReportsTab/>)}
              {value === 5 && (<AccountStatisticTab/>)}
             {/*  {value === 5 && (<AccountExpenseGridTab/>)} */}
              {/* {value === 5 && (<AccountTest/>)} */}

            </Paper>
            </Box>
{/*         </MembersContext.Provider> */}
      </div>
    </>
  )
}

export default AccountPage