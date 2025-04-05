import '../../Types/date.extensions';
import { Box, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, Paper, Typography } from '@mui/material';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import MobileTransaction, { getSign, ShekelIcon } from '../../Components/Accounts/MobileTransaction';
import DatePickerDate from '../../Components/Buttons/DatePickerDate';
import FullScreenLoader from '../../Components/FullScreenLoader';
import GeneralDrawer from '../../Components/GeneralDrawer';
import { useFetchAccountSearchQuery } from '../../features/Account/accountApiSlice'
import { COrderDescription, IAccount } from '../../Interfaces/API/IAccount';
import { CTransaction, ITransaction } from '../../Interfaces/API/IClub';
import { ILoginResult } from '../../Interfaces/API/ILogin';
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container'
import DateRangeIcon from '@mui/icons-material/DateRange';
import { SetProperty } from '../../Utils/setProperty';
import FilterListIcon from '@mui/icons-material/FilterList';
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons';
import InvoicePage from '../Report/InvoicePage';
import { IInvoiceTableData, IInvoiceTableHeader, IInvoiceTableRow, InvoiceProps, defaultInvoiceDetailes, defaultInvoiceMember, defaultInvoiceProps } from '../../Interfaces/IReport';
import QuarterButtons from '../../Components/Buttons/QuarterButtons';
import UserAccountTable from '../../Components/Tables/UserAccountTable';
import { EQuarterOption } from '../../Utils/enums';
import { IQuarterFilter } from '../../Interfaces/IDateFilter';

function UserAccountTab() {
  const login: ILoginResult = useAppSelector<ILoginResult>((state) => state.authSlice);
  const [openFilter, setOpenFilter] = useState(false)
  const [accountFilter, setAccountFilter] = useState({ member: login.member._id,from: (new Date()).getStartOfYear().toLocaleString() ,to: (new Date()).getEndOfYear().toLocaleString(),quarter:  (new Date()).getQuarter()}) 
 
  const { data, isLoading, isError, error } = useFetchAccountSearchQuery({});
  /* const [filter, setFilter] = useState<IOrderTableFilter>(Current_Quarter_Filter()); */
  const [openSaveAsPDF, setOpenSaveAsPDF] = useState(false);
  const [changeView, setChangeView] = useState(true);
  const [invoiceProps, setInvoiceProps] = useState<InvoiceProps>(defaultInvoiceProps);
  const [transcations, setTransactions] = useState<ITransaction[]>([])
  const [account, setAccount] = useState<IAccount | undefined>(undefined)
  const [balance, setBalance] = useState<number>(0);
/*   let date_s = (new Date()).getStartQuarterDate(2023, 4);
  console.log("getStartQuarterDate/start", date_s.toLocaleString())
  let date_e = (new Date()).getEndQuarterDate(2023, 4);
  console.log("getStartQuarterDate/end", date_e.toLocaleString()) */
  

 
  useEffect(() => {
    if (account !== undefined && transcations.length >= 0) {
      try {
        const invoiceHeader: IInvoiceTableHeader = {
          header: [
            { title: "Date", toolTip: "Issue Date" },
            { title: "Description", toolTip: "Description" },
            { title: "Operation", toolTip: "Flight/" },
            { title: "Total", toolTip: "Total in shekel" }
          ]
        }
        const invoiceMember = defaultInvoiceMember;
        const invoiceDetailes = defaultInvoiceDetailes;
        invoiceMember.family_name = account.member.family_name
        invoiceMember.first_name = account.member.first_name
        invoiceMember.member_id = account.member.member_id
        invoiceDetailes.member = invoiceMember;
        invoiceDetailes.invoiceNo = `${Date.now()}/${account.member.member_id}`
        invoiceDetailes.mainTitle = `Account ${account.account_id} balance: ${account.balance}`

        let total: number = 0;
        const invoiceItems: IInvoiceTableData = {
          

          rows: transcations.map((i, j) => {
            let row: IInvoiceTableRow;
            total = total + CTransaction.getAmount(i, account.account_id);
            row = { row: [{ data: (new Date(i.date)).getDisplayDate(), toolTip: "Issue Date" }, { data: COrderDescription.displayTransaction(i.description), toolTip: "Item Description" }, { data: `${i.order.type.toString()} ${i.type}`, toolTip: "Order" }, { data: CTransaction.getAmount(i, account.account_id).toFixed(2), toolTip: "Total" }] }
            CustomLogger.info("UserAccountTab/ReportData/transcations.map", i, j, row)
            return row
          }),
          total: total
        }
        CustomLogger.info("UserAccountTab/ReportData/transaction", transcations)
        CustomLogger.info("UserAccountTab/ReportData/invoiceProps", invoiceItems, invoiceHeader, invoiceDetailes)
        setInvoiceProps((prev) => ({ ...prev, invoiceHeader: invoiceHeader, invoiceItems: invoiceItems, total: total, invoiceDetailes: invoiceDetailes }))
      }
      catch (error) {
        CustomLogger.info("UserAccountTab/ReportData/error", error)
      }

    }

  }, [account, transcations, balance,accountFilter])
  useEffect(() => {
    if (data?.data !== null && data?.data !== undefined) {
      CustomLogger.info("UserAccountTab/useEffect/data?.data", data?.data)
      const account: IAccount | undefined = data.data.find((account) => account.member._id === login.member._id);

      if (account !== undefined) {
        CustomLogger.info("UserAccountTab/useEffect/account.balance", account.balance)
        setBalance(account.balance)
        let from: Date = new Date(accountFilter.from);
        let to: Date = new Date(accountFilter.to);
        
        let filterdTransaction = account.transactions.filter((i) => { 
          let date = new Date(i.date)
          console.log("UserAccountTab/useEffect/filterLoop" ,to.compareDate(new Date(i.date)),from.compareDate(date))
          return to.compareDate(date) >= 0 && from.compareDate(date) <= 0
        } ) 
        CustomLogger.info("UserAccountTab/useEffect/filterdTransaction", account.transactions,filterdTransaction)
        setTransactions(filterdTransaction);
        setAccount(account);

      }
    }

  }, [data, accountFilter])

  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.info("UserAccountTab/Filter/onDateChanged", key, value, accountFilter)
    if (value === null) return;
    let newFilter = SetProperty(accountFilter, key, new Date(value));
    newFilter = SetProperty(newFilter, 'quarter', EQuarterOption.E_QO_Q0);

    setAccountFilter(newFilter)
    CustomLogger.info("UserAccountTab/Filter/onDateChanged/newFilter",newFilter)
  }

  const OnQuarterFilterChanged = (filter: IQuarterFilter) => {
    console.log("UserAccountTab/Filter/OnQuarterFilterChanged/filter", filter)
    let to: Date = (new Date())
    let from: Date = (new Date())
    if(filter.quarter !== EQuarterOption.E_QO_Q0)
    {
      from = to.getStartQuarterDate(filter.year, filter.quarter);
      to  = from.getEndQuarterDate(filter.year, filter.quarter);
    
    }
    else {
      from = from.getStartOfYear();
      to = to.getEndOfYear();
      console.log("UserAccountTab/Filter/OnQuarterFilterChanged/filter", filter)
    }
    setAccountFilter((prev) => ({...prev, from : from.toLocaleString(), to: to.toLocaleString() ,quarter:  filter.quarter}))
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.log("UserAccountTab/onAction", event?.target, action, item)
    switch (action) {
      case EAction.SAVE:
        setOpenSaveAsPDF(!openSaveAsPDF);
        break;
      case EAction.OTHER:
        setChangeView(!changeView)
      break;
    }
  }
  CustomLogger.log("UserAccountTab/filter", accountFilter)

  return (
    <Box fontSize={{ xs: "1rem", md: "1.2rem" }} height={'100%'}>
      <ContainerPage >
        <>
          <ContainerPageHeader>
            <Paper >
              <Grid container sx={{ width: "100%", height: "100%" }} rowGap={1} gap={1} justifyContent="space-around" columns={12}>
                <Grid item xs={12} lg={6} mx={{ xs: 0, lg: 1 }} sx={{ maxWidth: { xs: "100%", md: "48%" } }}>
                  <Box gap={1} style={{ display: "flex", alignItems: "baseline", flexDirection: "row", justifyContent: "flex-start" }}>
                    <Box>
                      <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpenFilter(true)}>
                        <FilterListIcon fontSize="inherit" />
                      </IconButton>
                      <GeneralDrawer open={openFilter} setOpen={setOpenFilter}>
                        <List sx={{ display: 'flex', flexDirection: 'column' }}>
                          <ListItem key={"fromDate"} disablePadding>
                            <ListItemButton>
                              <ListItemIcon>
                                <DateRangeIcon />
                              </ListItemIcon>
                              <DatePickerDate value={accountFilter.from === undefined ? new Date() : new Date(accountFilter.from)} param="from" lable='From Date' onChange={onDateChanged} />
                            </ListItemButton>
                          </ListItem>
                          <ListItem key={"toDate"} disablePadding>
                            <ListItemButton>
                              <ListItemIcon>
                                <DateRangeIcon />
                              </ListItemIcon>
                              <DatePickerDate value={accountFilter.to === undefined ? new Date() : new Date(accountFilter.to)} param={"to"} lable='To Date' onChange={onDateChanged} />
                            </ListItemButton>
                          </ListItem>
                          <ListItem key={"qurater"}>
                            <QuarterButtons quarterFilter={{ quarter: accountFilter.quarter, year: (new Date()).getFullYear() }} onChange={OnQuarterFilterChanged} />
                          </ListItem>
                        </List>
                      </GeneralDrawer>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, marginLeft: "2.5%" }}>
                        Balance:
                      </Typography>
                    </Box>
                    <Box>
                      <ShekelIcon sx={{ fontSize: "0.6rem" }} />
                    </Box>
                    <Box>
                      <Typography noWrap={false} style={{ color: getSign(balance) }}>{balance.toFixed(2)}</Typography>

                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={6} mx={{ xs: 0, lg: 1 }} sx={{ maxWidth: { xs: "100%", md: "48%" } }}>
                  <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box gap={1} style={{ width: '100%', display: "flex", alignItems: "baseline", flexDirection: "row", justifyContent: "space-between" }}>
                      <Box>
                        <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, marginLeft: "2.5%" }}>
                          AccountId:  {account?.account_id}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, marginLeft: "2.5%" }}>
                          Name:  {account?.member.family_name}
                        </Typography>
                      </Box>
                      <Box>
                        <ActionButtons OnAction={onAction} show={[EAction.SAVE,EAction.OTHER]} item={""} display={[{ key: EAction.SAVE, value: "Export PDF" },{ key: EAction.OTHER, value: "View" }]} />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Divider />
            </Paper>
          </ContainerPageHeader>
          <ContainerPageMain>
            <>
              {isLoading === true ? "loading" : null}
              {(isError === false && isLoading === false && openSaveAsPDF === false) ?
                (
                  <Grid container sx={{ width: "100%", height: "100%" }} rowGap={1} gap={1} justifyContent="space-around" columns={12}>
                    {changeView == true ? (
                    <>
                    {transcations.map((transaction) => (
                      <Grid item xs={12} sm={12} lg={12} mx={{ xs: 0, lg: 1 }} sx={{ maxWidth: { xs: "100%", lg: "90%" } }}>
                        <MobileTransaction item={transaction} accountId={account?.account_id} />
                      </Grid>
                    ))}
                    </>
                    ): 
                    (
                     <>
                    <UserAccountTable transactions={transcations}/> 
                     </>
                     )}
{/*                     {transcations.map((transaction) => (
                      <Grid item xs={12} lg={6} mx={{ xs: 0, lg: 1 }} sx={{ maxWidth: { xs: "100%", lg: "48%" } }}>
                        <MobileTransaction item={transaction} accountId={account?.account_id} />
                      </Grid>
                    ))} */}
                    
                  </Grid>
                ) :
                (
                  <Fragment>
                    {(openSaveAsPDF === true) ?
                      (<Fragment>
                        <InvoicePage invoiceItems={invoiceProps.invoiceItems} invoiceHeader={invoiceProps.invoiceHeader} invoiceDetailes={invoiceProps.invoiceDetailes}></InvoicePage>  
                      </Fragment>) :
                      (<Fragment>
                        <Box>
                          <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, marginLeft: "2.5%" }}>
                            userAccout Error:  {error === undefined ? "Undefined Error" : error.toString()}
                          </Typography>
                        </Box>
                      </Fragment>)}
                  </Fragment>
                )}
            </>
          </ContainerPageMain>
          <ContainerPageFooter>
            <>
              {isLoading === true ? <FullScreenLoader /> : null}
              {isError === true ? "Error" : null}
            </>
          </ContainerPageFooter>
        </>

      </ContainerPage>
    </Box>
  )
}

export default UserAccountTab