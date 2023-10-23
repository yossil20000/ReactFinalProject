import { Box, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, Paper, Typography } from '@mui/material';
import { Fragment, useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import MobileTransaction, { getSign, ShekelIcon } from '../../Components/Accounts/MobileTransaction';
import DatePickerDate from '../../Components/Buttons/DatePickerDate';
import FullScreenLoader from '../../Components/FullScreenLoader';
import GeneralDrawer from '../../Components/GeneralDrawer';
import { useFetchAccountSearchQuery } from '../../features/Account/accountApiSlice'
import { IAccount } from '../../Interfaces/API/IAccount';
import { ITransaction } from '../../Interfaces/API/IClub';
import { ILoginResult } from '../../Interfaces/API/ILogin';
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container'
import DateRangeIcon from '@mui/icons-material/DateRange';
import { from_to_Filter, IOrderTableFilter } from '../../Utils/filtering';
import { SetProperty } from '../../Utils/setProperty';
import FilterListIcon from '@mui/icons-material/FilterList';
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons';
import InvoicePage from '../Report/InvoicePage';
import { IInvoiceTableData, IInvoiceTableHeader, IInvoiceTableRow, InvoiceProps ,defaultInvoiceProps} from '../../Interfaces/IReport';
function UserAccountTab() {
  const login: ILoginResult = useAppSelector<ILoginResult>((state) => state.authSlice); 
  const [openFilter, setOpenFilter] = useState(false)
  const [accountFilter, setAccountFilter] = useState({ member: [login.member._id] })
  const { data, isLoading, isError, error } = useFetchAccountSearchQuery(accountFilter);
  const [filter, setFilter] = useState<IOrderTableFilter>(from_to_Filter(new Date()));
  const [openSaveAsPDF, setOpenSaveAsPDF] = useState(false);
  const [invoiceProps,setInvoiceProps] = useState<InvoiceProps>(defaultInvoiceProps);
  const [transcations,setTransactions] = useState<ITransaction[]>( [])
  const getInvoiceReportData = (transaction: ITransaction[]) => {
    try{
      const invoiceHeader: IInvoiceTableHeader = {
        header:  [
          {title: "Date",toolTip: "Issue Date"},
          {title: "Description",toolTip: "Description"},
          {title: "Operation",toolTip: "Flight/"},
          {title: "Total",toolTip: "Total in shekel"}
        ]
      }
      const invoiceItems : IInvoiceTableData = {
        
        rows: transaction.map((i,j) => {
          let row: IInvoiceTableRow;
          row = {row: [{data: (new Date(i.date)).toLocaleDateString(),toolTip:"Issue Date"},{data: i.description,toolTip:"Item Description"},{data: i.order.type.toString(),toolTip: "Order"},{data: i.amount.toFixed(2),toolTip: "Total"}]}
          CustomLogger.info("UserAccountTab/getInvoiceReportData/transcations.map", j,row)
          return row 
        })
      
      }
      CustomLogger.info("UserAccountTab/getInvoiceReportData/invoiceItems_", invoiceItems,invoiceHeader)
      setInvoiceProps((prev) => ({...prev,invoiceHeader: invoiceHeader,invoiceItems: invoiceItems }))
    }
    catch(error){
      CustomLogger.info("UserAccountTab/getInvoiceReportData/error", error)
    }
    
  }
  const getTransaction = useMemo((): ITransaction[] | [] => {
    CustomLogger.info("UserAccountTab/getTransaction/data", data?.data)

    if (data?.data !== null && data?.data !== undefined) {
      CustomLogger.info("UserAccountTab/getTransaction/dataok", data?.data, login.member._id)
      const account: IAccount | undefined = data?.data.find((a) => a.member._id === login.member._id);
      if (account !== undefined) {
        CustomLogger.info("UserAccountTab/getTransaction/accountFound", account, account.transactions)
        setTransactions(account.transactions)
        getInvoiceReportData(account.transactions)
        return account.transactions
      }
    }
    return []
  }, [data])
  

  const getAccount = useMemo((): IAccount | undefined => {
    if (data?.data !== null && data?.data !== undefined) {
      CustomLogger.info("UserAccountTab/getAccount/data?.data", data?.data)
      const account: IAccount | undefined = data.data.find((account) => account.member._id === login.member._id);
      
      if (account !== undefined) {
        return account
      }
    }
    return undefined
  }, [data])

  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.log("UserAccountTab/onDateChanged", key, value, filter)
    if (value === null) return;
    const newFilter = SetProperty(filter, key, new Date(value));
    setFilter(newFilter)
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.log("UserAccountTab/onAction", event?.target, action, item)
    switch (action) {
      case EAction.SAVE:
        setOpenSaveAsPDF(!openSaveAsPDF);
        break;
    }
  }

  
  return (
    <Box fontSize={{ xs: "1rem", md: "1.2rem" }}>
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
                              <DatePickerDate value={filter.from === undefined ? new Date() : filter.from} param="from" lable='From Date' onChange={onDateChanged} />
                            </ListItemButton>
                          </ListItem>
                          <ListItem key={"toDate"} disablePadding>
                            <ListItemButton>
                              <ListItemIcon>
                                <DateRangeIcon />
                              </ListItemIcon>
                              <DatePickerDate value={filter.to === undefined ? new Date() : filter.to} param={"to"} lable='To Date' onChange={onDateChanged} />
                            </ListItemButton>
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
                      <Typography noWrap={false} style={{ color: getSign(getAccount?.balance) }}>{getAccount?.balance.toFixed(2)}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={6} mx={{ xs: 0, lg: 1 }} sx={{ maxWidth: { xs: "100%", md: "48%" } }}>
                  <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box gap={1} style={{ width: '100%', display: "flex", alignItems: "baseline", flexDirection: "row", justifyContent: "space-between" }}>
                      <Box>
                        <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, marginLeft: "2.5%" }}>
                          AccountId:  {getAccount?.account_id}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, marginLeft: "2.5%" }}>
                          Name:  {getAccount?.member.family_name}
                        </Typography>
                      </Box>
                      <Box>
                        <ActionButtons OnAction={onAction} show={[EAction.SAVE]} item={""} display={[{ key: EAction.SAVE, value: "PDF" }]} />
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
                  {getTransaction.map((transaction) => (
                    <Grid item xs={12} lg={6} mx={{ xs: 0, lg: 1 }} sx={{ maxWidth: { xs: "100%", lg: "48%" } }}>
                      <MobileTransaction item={transaction} accountId={getAccount?.account_id} />
                    </Grid>
                  ))}
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