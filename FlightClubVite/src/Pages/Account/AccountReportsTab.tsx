
import { Box, Grid, IconButton } from '@mui/material';
import { Fragment, useMemo, useState } from 'react';
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import TransactionTable, { ITransactionTableFilter } from '../../Components/TransactionTable';

import useLocalStorage from '../../hooks/useLocalStorage';
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
import { useClubAccountQuery } from '../../features/Account/accountApiSlice';
import { IClubAccount } from '../../Interfaces/API/IClub';
import { IAccount } from '../../Interfaces/API/IAccount';

const dateFilter: IDateFilter = fullYearFilter;

function AccountReportsTab() {
  const { data: bankAccounts } = useClubAccountQuery(true);
  const [bank, setBank] = useState<IClubAccount | undefined>();

  const isAuthorized = UseIsAuthorized({ roles: [Role.desk, Role.admin, Role.account] })
  const [selectedClubAccount, setSelectedClubAccount] = useLocalStorage<InputComboItem | null>("_accountTransaction/selectedClubAccoun", null)
  const [openFilter, setOpenFilter] = useState(false)
  const [openExpenseSave, setOpenExpenseSave] = useState(false);
  /* const [dateTo,setDateTo] = useLocalStorage("_filter/dateTo", dateFilter.to)
  const [dateFrom,setDateFrom] = useLocalStorage("_filter/dateFrom", dateFilter.from) */
  const [dateTo, setDateTo] = useState(dateFilter.to)
  const [dateFrom, setDateFrom] = useState(dateFilter.from)
  const [filter, setFilter] = useState<ITransactionTableFilter>({ dateFilter: dateFilter } as ITransactionTableFilter);

  /*   const [openAddCredit, setOpenAddCredit] = useState(false);
    const [openAddDebit, setOpenAddDebit] = useState(false); */
  const OnSelectedClubAccount = (item: InputComboItem): void => {
    CustomLogger.info("OnSelectedClubAccount/item", item)
    setSelectedClubAccount(item);

  }
  const [openSaveAsPDF, setOpenSaveAsPDF] = useState(false);

  const onFilterChanged = (key: string, value: any): void => {
    CustomLogger.log("onFilterChanged/key,value,filter", key, value, filter)
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
    CustomLogger.log("AccountExpenseTab/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:
        switch (item) {
          case "PAY":
            break;
          case "TRANSACTION":
            break;
        }
        break;
      case EAction.SAVE:
        setOpenExpenseSave(!openExpenseSave);
        break;
    }
  }
  const handleAddOnClose = () => {

  }

  const handleAddOnSave = () => {

  }
  const getData = useMemo(() => {
    let bankFound: IClubAccount | undefined = undefined;
    if (bankAccounts?.data !== undefined && bankAccounts?.data.length > 0) {
      bankFound = bankAccounts?.data.find((bank) =>
         (bank.club.brand === "BAZ" && bank.club.branch === "HAIFA"))
      if(bankFound === undefined && bankAccounts?.data.length == 1)
        bankFound = bankAccounts.data[0]
      setBank(bankFound)
    }
    CustomLogger.info("AccountReportsTab/getData/bankAccounts,bank", bankAccounts, bank,bankFound);

    const rows = bankFound?.transactions.map((row) => {

      let foundAccount: IAccount | undefined = undefined

      if (bankFound !== undefined) {
        //CustomLogger.info("AccountReportsTab/getData/bank,row", bankFound.accounts, row.account_id);
        //foundAccount =   bankFound.accounts.find((account) => account.account_id == row.account_id)
        CustomLogger.info("AccountReportsTab/getData/foundAccount", foundAccount);
        if (foundAccount) {
          //bankRow = <Box><div>{bankFound.club.brand}/{bankFound.club.branch}</div><div>{bankFound.club.account_id}</div></Box>
        }

      }
      return row
      //return createData(bankRow, row._id, row.account_id, row.member?.member_type, row.member?.family_name, row.balance, row.status, row.description, <><ActionButtons OnAction={onAction} show={[EAction.EDIT]} item={row.account_id} /></>)
    })
    CustomLogger.info("AccountReportsTab/getData", rows)
    return rows === undefined ? [] : rows;
  }, [bankAccounts])
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
                <ActionButtons OnAction={onAction} show={[EAction.ADD]} item="TRANSACTION" display={[{ key: EAction.ADD, value: "Transaction" }]} disable={[{ key: EAction.ADD, value: isAuthorized }]} />
              </Grid>
              {/*               <Grid item xs={12} sm={6}>
                <ClubAccountsCombo onChanged={OnSelectedClubAccount} source={"_accountTransaction/selectedClubAccoun"} />
              </Grid > */}
            </Grid>
          </Box>
        </ContainerPageHeader>
        {
          (openSaveAsPDF === true) ? (
            <ContainerPageMain>
              <Fragment>

              </Fragment>
            </ContainerPageMain>
          ) : (
            <ContainerPageMain>
              <Fragment>
                <FilterDrawer open={openFilter} setOpen={setOpenFilter} onFilterChanged={onFilterChanged} items={getItems()}>
                  <ClubAccountsCombo onChanged={OnSelectedClubAccount} source={"_accountTransaction/selectedClubAccoun"} includesType={[MemberType.Club, MemberType.Member, MemberType.Supplier]} />
                </FilterDrawer>
              </Fragment>
            </ContainerPageMain>
          )
        }

        <ContainerPageFooter>
          <>
          </>
        </ContainerPageFooter>
      </>
    </ContainerPage>
  )
}

export default AccountReportsTab
