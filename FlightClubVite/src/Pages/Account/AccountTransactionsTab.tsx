
import { Box, Button, Grid, IconButton } from '@mui/material';
import { useState } from 'react';
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import TransactionTable, { ITransactionTableFilter } from '../../Components/TransactionTable';

import useLocalStorage from '../../hooks/useLocalStorage';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';

import React from 'react';
import FilterDrawer from '../../Components/FilterDrawer';
import { setProperty } from '../../Utils/setProperty';
import { IDateFilter, newDataFilter } from '../../Interfaces/IDateFilter';
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons';
import CreateTransactionDialog from './CreateTransactionDialog';
import NewTransactionDialog from './NewTransactionDialog';
import FilterListIcon from '@mui/icons-material/FilterList';
export interface IFilterItems {
  key: string;
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>
}
const dataFilter: IDateFilter = newDataFilter;

function AccountTransactionsTab() {
  const [selectedClubAccount, setSelectedClubAccount] = useLocalStorage<InputComboItem | null>("_accountTransaction/selectedClubAccoun", null)
  const [openFilter, setOpenFilter] = useState(false)
  /* const [dateTo,setDateTo] = useLocalStorage("_filter/dateTo", dataFilter.to)
  const [dateFrom,setDateFrom] = useLocalStorage("_filter/dateFrom", dataFilter.from) */
  const [dateTo, setDateTo] = useState(dataFilter.to)
  const [dateFrom, setDateFrom] = useState(dataFilter.from)
  const [filter, setFilter] = useState<ITransactionTableFilter>({ dataFilter: dataFilter } as ITransactionTableFilter);
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
  const OnSelectedClubAccount = (item: InputComboItem): void => {
    setSelectedClubAccount(item);

  }

  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("SetProperty/newobj", newObj, path, value)
    return newObj;
  }
  const onFilterChanged = (key: string, value: any): void => {
    console.log("onFilterChanged/key,value,filter", key, value, filter)
    const newKey = key == 'fromDate' ? "from" : key == 'toDate' ? 'to' : "";
    if (newKey == "") { console.log("onFilterChanged/ value not set", key); return }

    const newObj = SetProperty(filter, `dataFilter.${newKey}`, new Date(value));
    setFilter(newObj);

  }
  const getItems = (): IFilterItems[] => {
    return [{ key: "toDate", value: dateTo, setValue: setDateTo }, { key: "fromDate", value: dateFrom, setValue: setDateFrom }] as IFilterItems[]
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    console.log("AccountExpenseTab/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:

        setOpenAddTransaction(true)
        break;
    }
  }
  const handleAddOnClose = () => {
    setOpenAddTransaction(false);

  }
  const handleAddOnSave = () => {


    setOpenAddTransaction(false);


  }
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
              <Grid item xs={1}>
                <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpenFilter(true)}>
                  <FilterListIcon fontSize="inherit" />
                </IconButton>
              </Grid>
              <Grid item xs={3}>
                <ActionButtons OnAction={onAction} show={[EAction.ADD]} item="" display={[{ key: EAction.ADD, value: "Transaction" }]} />
              </Grid>
              <Grid item xs={4}  >
                <ClubAccountsCombo onChanged={OnSelectedClubAccount} source={"_accountTransaction/selectedClubAccoun"} />

              </Grid >

            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
          <>
            {(openAddTransaction == true) ? (<NewTransactionDialog onClose={handleAddOnClose} onSave={handleAddOnSave} open={openAddTransaction} />) : (null)}
            <FilterDrawer open={openFilter} setOpen={setOpenFilter} onFilterChanged={onFilterChanged} items={getItems()} />
            <TransactionTable selectedClubAccount={selectedClubAccount} filter={filter} />
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
