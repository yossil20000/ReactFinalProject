
import { Box, Button, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer } from '@mui/material';
import { useMemo, useState } from 'react';
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import TransactionTable, { ITransactionTableFilter } from '../../Components/TransactionTable';

import useLocalStorage from '../../hooks/useLocalStorage';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';

import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import React from 'react';
import FilterDrawer from '../../Components/FilterDrawer';
import { setProperty } from '../../Utils/setProperty';
import { IDateFilter } from '../../Interfaces/IDateFilter';
export interface IFilterItems {
  key: string;
  value: any;
  setValue:  React.Dispatch<React.SetStateAction<any>>
}
const dataFilter : IDateFilter ={
  to: (new Date().addDays(1)).getEndDayDate(),
  from: (new Date().addDays(-30)).getStartDayDate(),
  currentOffset: 0
}
function AccountTransactionsTab() {
  const [selectedClubAccount, setSelectedClubAccount] = useLocalStorage<InputComboItem | null>("_accountTransaction/selectedClubAccoun", null)
  const [openFilter, setOpenFilter] = useState(false)
  const [dateTo,setDateTo] = useLocalStorage("_filter/dateTo", dataFilter.to)
  const [dateFrom,setDateFrom] = useLocalStorage("_filter/dateFrom", dataFilter.from)
  const [filter,setFilter] = useState<ITransactionTableFilter>({dataFilter: dataFilter} as ITransactionTableFilter);
  const OnSelectedClubAccount = (item: InputComboItem): void => {
    setSelectedClubAccount(item);
    
  }
  
const SetProperty = (obj: any, path: string, value: any): any => {
  let newObj = { ...obj };
  newObj = setProperty(newObj, path, value);
  console.log("SetProperty/newobj", newObj,path,value)
  return newObj;
}
  const onFilterChanged = (key: string, value: any) : void => {
    console.log("onFilterChanged/key,value,filter",key,value,filter)
    const newKey = key == 'fromDate' ? "from" : key == 'toDate' ? 'to' : "";
    if(newKey == "") {console.log("onFilterChanged/ value not set", key) ; return}  
    
    const newObj = SetProperty(filter,`dataFilter.${newKey}`,new Date(value));
    setFilter(newObj);

  }
  const getItems = () : IFilterItems[] => {
  return [{key: "toDate", value: dateTo, setValue:setDateTo },{key: "fromDate", value: dateFrom, setValue:setDateFrom }] as  IFilterItems[]
  }
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
              <Grid item xs={1}> <Button onClick={() => setOpenFilter(true)}>Filter</Button></Grid>
              <Grid item xs={4}  >
                <ClubAccountsCombo onChanged={OnSelectedClubAccount} source={"_accountTransaction/selectedClubAccoun"} />

              </Grid >
            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
          <>
            <FilterDrawer open={openFilter} setOpen={setOpenFilter} onFilterChanged={onFilterChanged} items={getItems()} />
            <TransactionTable selectedClubAccount={selectedClubAccount} filter={filter}/>
          </>

        </ContainerPageMain>
        <ContainerPageFooter>
          <>
            footer
          </>
        </ContainerPageFooter>
      </>

    </ContainerPage>
  )
}

export default AccountTransactionsTab
