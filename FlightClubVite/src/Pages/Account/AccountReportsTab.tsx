
import { Box, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { Fragment, useState } from 'react';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { ITransactionTableFilter } from '../../Components/TransactionTable';

import useSessionStorage from '../../hooks/useLocalStorage';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';

import React from 'react';
import { SetProperty } from '../../Utils/setProperty';
import { IFilterItems, IQuarterDateFilter, IQuarterFilter, newQuarterDateFilter } from '../../Interfaces/IDateFilter';
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons';
import FilterListIcon from '@mui/icons-material/FilterList';
import { UseIsAuthorized } from '../../Components/RequireAuth';
import { Role } from '../../Interfaces/API/IMember';
import TranasctionsReportPage from '../Report/TransactionsReport/TranasctionsReportPage';
import QuarterButtons from '../../Components/Buttons/QuarterButtons';
import { DateRangeIcon } from '@mui/x-date-pickers';
import DatePickerDate from '../../Components/Buttons/DatePickerDate';
import GeneralDrawer from '../../Components/GeneralDrawer';
import { EQuarterOption } from '../../Utils/enums';



const quarterDateFilter: IQuarterDateFilter = newQuarterDateFilter;

function AccountReportsTab() {
  const isAuthorized = UseIsAuthorized({ roles: [Role.desk, Role.admin, Role.account] })
  const [selectedClubAccount, setSelectedClubAccount] = useSessionStorage<InputComboItem | null>("_accountTransaction/selectedClubAccoun", null)
  const [openFilter, setOpenFilter] = useState(false)

  const [dateTo, setDateTo] = useState(quarterDateFilter.to)
  const [dateFrom, setDateFrom] = useState(quarterDateFilter.from)
  const [filter, setFilter] = useState<IQuarterDateFilter>(quarterDateFilter);
  /*   const [openAddCredit, setOpenAddCredit] = useState(false);
    const [openAddDebit, setOpenAddDebit] = useState(false); */
  const OnSelectedClubAccount = (item: InputComboItem): void => {
    CustomLogger.info("AccountReportsTab/OnSelectedClubAccount/item", item)
    setSelectedClubAccount(item);

  }
  const [openSaveAsPDF, setOpenSaveAsPDF] = useState(false);

  const onFilterChanged = (key: string, value: any): void => {
    CustomLogger.info("AccountReportsTab/onFilterChanged/key,value,filter", key, value, filter)
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
    CustomLogger.log("AccountReportsTab/onAction", event?.target, action, item)
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
  const OnQuarterFilterChanged = (filter: IQuarterFilter) => {
    console.log("AccountReportsTab/OnQuarterFilterChanged/filter", filter)
    let to: Date = (new Date())
    let from: Date = (new Date())
    if (filter.quarter !== EQuarterOption.E_QO_Q0) {
      from = to.getStartQuarterDate(filter.year, filter.quarter);
      to = from.getEndQuarterDate(filter.year, filter.quarter);

    }
    else {
      from = from.getStartOfYear();
      to = to.getEndOfYear();
      console.log("AccountReportsTab/Filter/OnQuarterFilterChanged/filter", filter)
    }
    const newFilter : IQuarterDateFilter = {
      quarterFilter: {
        quarter: filter.quarter,
        year: filter.year
      },
      from: from,
      to: to,
      currentOffset: from.getTimezoneOffset()
    }
    setFilter(newFilter);
  }
  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.info("AccountReportsTab/Filter/onDateChanged", key, value, filter)
    if (value === null) return;
    let newFilter = SetProperty(filter, `${key}`, new Date(value));
    newFilter = SetProperty(filter, 'quarterFilter.quarter', EQuarterOption.E_QO_Q0);
    setFilter(newFilter)
  }
  
  function getTransactionFilter(quarterFilter: IQuarterDateFilter) : ITransactionTableFilter {
    const transactioFilter :ITransactionTableFilter = {
      dateFilter: {
        from: filter.from,
        to: filter.to,
        currentOffset: filter.currentOffset
      }

    }
    return transactioFilter;
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
                <TranasctionsReportPage filter={getTransactionFilter(filter)} ></TranasctionsReportPage>
              </Fragment>
            </ContainerPageMain>
          ) : (
            <ContainerPageMain>
              <Fragment>
                {/*                 <FilterDrawer open={openFilter} setOpen={setOpenFilter} onFilterChanged={onFilterChanged} items={getItems()}>
                  <QuarterButtons quarterFilter={{ quarter: (new Date()).getQuarter(), year: (new Date()).getFullYear() }} onChange={OnQuarterFilterChanged} />
                  <ClubAccountsCombo onChanged={OnSelectedClubAccount} source={"_accountTransaction/selectedClubAccoun"} includesType={[MemberType.Club, MemberType.Member, MemberType.Supplier]} />
                </FilterDrawer> */}
                <GeneralDrawer open={openFilter} setOpen={setOpenFilter}>
                  <List sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ListItem key={"fromDate"} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <DateRangeIcon />
                        </ListItemIcon>
                        <DatePickerDate value={filter?.from === undefined ? new Date() : new Date(filter.from)} param="from" lable='From Date' onChange={onDateChanged} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem key={"toDate"} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <DateRangeIcon />
                        </ListItemIcon>
                        <DatePickerDate value={filter?.to === undefined ? new Date() : new Date(filter.to)} param={"to"} lable='To Date' onChange={onDateChanged} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem key={"qurater"}>
                      <QuarterButtons quarterFilter={{ quarter: filter?.quarterFilter.quarter, year: (new Date()).getFullYear() }} onChange={OnQuarterFilterChanged} />
                    </ListItem>
                  </List>
                </GeneralDrawer>
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
