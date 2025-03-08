
import { Box, Grid, IconButton } from '@mui/material';
import { Fragment, useState } from 'react';
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import TransactionTable, { ITransactionTableFilter } from '../../Components/TransactionTable';

import useSessionStorage from '../../hooks/useLocalStorage';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';

import React from 'react';
import FilterDrawer from '../../Components/FilterDrawer';
import { SetProperty } from '../../Utils/setProperty';
import { IDateFilter, IFilterItems, fullYearFilter } from '../../Interfaces/IDateFilter';
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons';
import PayTransactionDialog from './PayTransactionDialog';
import FilterListIcon from '@mui/icons-material/FilterList';
import GeneralTransactionDialog from './GeneralTransactionDialog';
import { UseIsAuthorized } from '../../Components/RequireAuth';
import { MemberType, Role } from '../../Interfaces/API/IMember';

const dateFilter: IDateFilter = fullYearFilter;

function AccountTransactionsTab() {
  const isAuthorized = UseIsAuthorized({  roles: [Role.desk, Role.admin, Role.account]})
  const [selectedClubAccount, setSelectedClubAccount] = useSessionStorage<InputComboItem | null>("_accountTransaction/selectedClubAccoun", null)
  const [openFilter, setOpenFilter] = useState(false)
  const [openExportSave, setOpenExportSave] = useState(false);
  /* const [dateTo,setDateTo] = useLocalStorage("_filter/dateTo", dateFilter.to)
  const [dateFrom,setDateFrom] = useLocalStorage("_filter/dateFrom", dateFilter.from) */
  const [dateTo, setDateTo] = useState(dateFilter.to)
  const [dateFrom, setDateFrom] = useState(dateFilter.from)
  const [filter, setFilter] = useState<ITransactionTableFilter>({ dateFilter: dateFilter } as ITransactionTableFilter);
  const [openPayTransaction, setOpenPayTransaction] = useState(false);
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
/*   const [openAddCredit, setOpenAddCredit] = useState(false);
  const [openAddDebit, setOpenAddDebit] = useState(false); */
  const OnSelectedClubAccount = (item: InputComboItem): void => {
    CustomLogger.info("AccountTransactionsTab/OnSelectedClubAccount/item",item)
    setSelectedClubAccount(item);

  }


  const onFilterChanged = (key: string, value: any): void => {
    CustomLogger.info("AccountTransactionsTab/onFilterChanged/key,value,filter", key, value, filter)
    const newKey = key == 'fromDate' ? "from" : key == 'toDate' ? 'to' : "";
    if (newKey == "") { CustomLogger.log("onFilterChanged/ value not set", key); return }

    const neWABj = SetProperty(filter, `dateFilter.${newKey}`, new Date(value));
    setFilter(neWABj);

  }
  const getItems = (): IFilterItems[] => {
    return [{ key: "toDate", value: dateTo, setValue: setDateTo }, { key: "fromDate", value: dateFrom, setValue: setDateFrom }] as IFilterItems[]
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.info("AccountTransactionsTab/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:
      switch(item) {
        case "PAY":    
        setOpenPayTransaction(true)
        break;
        case "TRANSACTION":   
        setOpenAddTransaction(true)
        break;

      }
      break;
      case EAction.SAVE:
        setOpenExportSave(!openExportSave);
        break;
    }
  }
  const handleAddOnClose = () => {
    setOpenPayTransaction(false);
    setOpenAddTransaction(false)
  }

  const handleAddOnSave = () => {
    setOpenPayTransaction(false);
    setOpenAddTransaction(false)
  }
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
              <Grid item xs={2} sm={2}>
                <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpenFilter(true)}>
                  <FilterListIcon fontSize="inherit" />
                </IconButton>
              </Grid>
              <Grid item xs={12} sm={3}>
                <ActionButtons  OnAction={onAction} show={[EAction.ADD]} item="TRANSACTION" display={[{ key: EAction.ADD, value: "Transaction" }]} disable={[{key: EAction.ADD,value: !isAuthorized}]}/>
              </Grid>
              <Grid item xs={12} sm={3}>
                <ActionButtons OnAction={onAction} show={[EAction.ADD]} item="PAY" display={[{ key: EAction.ADD, value: "Payment" }]} disable={[{key: EAction.ADD,value: !isAuthorized}]}/>
              </Grid>
              <Grid item xs={12} sm={3}>
                <ActionButtons OnAction={onAction} show={[EAction.SAVE]} item="EXPORT" display={[{ key: EAction.SAVE, value: "Export" }]} disable={[{key: EAction.SAVE,value: !isAuthorized}]}/>
              </Grid>
{/*               <Grid item xs={12} sm={6}>
                <ClubAccountsCombo onChanged={OnSelectedClubAccount} source={"_accountTransaction/selectedClubAccoun"} />
              </Grid > */}
            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
          <Fragment>
            {(openPayTransaction == true) ? (<PayTransactionDialog onClose={handleAddOnClose} onSave={handleAddOnSave} open={openPayTransaction} />) : (null)}
            {(openAddTransaction == true) ? (<GeneralTransactionDialog onClose={handleAddOnClose} onSave={handleAddOnSave} open={openAddTransaction} />) : (null)}
            <FilterDrawer open={openFilter} setOpen={setOpenFilter} onFilterChanged={onFilterChanged} items={getItems()}>
              <ClubAccountsCombo onChanged={OnSelectedClubAccount} source={"_accountTransaction/selectedClubAccoun"} includesType={[MemberType.Club,MemberType.Member,MemberType.Supplier]} />
            </FilterDrawer>
            <TransactionTable selectedClubAccount={selectedClubAccount} filter={filter}  transactionSave={openExportSave} setTransactionSave={setOpenExportSave}/>
          </Fragment>
        </ContainerPageMain>
        <ContainerPageFooter>
          <>
          </>
        </ContainerPageFooter>
      </>
    </ContainerPage>
  )
}

export default AccountTransactionsTab
