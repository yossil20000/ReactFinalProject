
import { Box, Grid, IconButton } from '@mui/material';
import { Fragment, useState } from 'react';
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { ITransactionTableFilter } from '../../Components/TransactionTable';

import useLocalStorage from '../../hooks/useLocalStorage';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';

import React from 'react';
import FilterDrawer from '../../Components/FilterDrawer';
import { SetProperty } from '../../Utils/setProperty';
import { IDateFilter, IFilterItems, fullYearFilter } from '../../Interfaces/IDateFilter';
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons';
import FilterListIcon from '@mui/icons-material/FilterList';
import { UseIsAuthorized } from '../../Components/RequireAuth';
import { MemberType, Role } from '../../Interfaces/API/IMember';
import TranasctionsReportPage from '../Report/TransactionsReport/TranasctionsReportPage';

const dateFilter: IDateFilter = fullYearFilter;

function AccountReportsTab() {
  const isAuthorized = UseIsAuthorized({ roles: [Role.desk, Role.admin, Role.account] })
  const [selectedClubAccount, setSelectedClubAccount] = useLocalStorage<InputComboItem | null>("_accountTransaction/selectedClubAccoun", null)
  const [openFilter, setOpenFilter] = useState(false)

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
    CustomLogger.info("onFilterChanged/key,value,filter", key, value, filter)
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
        setOpenSaveAsPDF(!openSaveAsPDF)
        break;
    }
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
                <ActionButtons OnAction={onAction} show={[EAction.SAVE]} item="TRANSACTION" display={[{ key: EAction.SAVE, value: openSaveAsPDF == false ? "Show PDF" : "Hide" }]} disable={[{ key: EAction.ADD, value: isAuthorized }]} />
              </Grid>
            </Grid>
          </Box>
        </ContainerPageHeader>
        {
          (openSaveAsPDF === true) ? (
            <ContainerPageMain>
              <Fragment>
                <TranasctionsReportPage filter={filter} ></TranasctionsReportPage>
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
