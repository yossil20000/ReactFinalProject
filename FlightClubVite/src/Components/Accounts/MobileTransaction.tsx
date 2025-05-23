import '../../Types/date.extensions';
import { Accordion, AccordionDetails, AccordionSummary, Box, Fab, Grid, SvgIcon, SvgIconProps, Tooltip, Typography } from '@mui/material'
import { CTransaction, ITransaction, Transaction_OT } from '../../Interfaces/API/IClub'
import FlightIcon from '@mui/icons-material/Flight';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import { green } from '@mui/material/colors';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
export interface MobileTransactionProps {
  item: ITransaction;
  accountId: string | undefined;
}
function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  )
}
export function ShekelIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" ><path d="M248 168v168c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V168c0-75.11-60.89-136-136-136H24C10.75 32 0 42.74 0 56v408c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V112h112c30.93 0 56 25.07 56 56zM432 32h-48c-8.84 0-16 7.16-16 16v296c0 30.93-25.07 56-56 56H200V176c0-8.84-7.16-16-16-16h-48c-8.84 0-16 7.16-16 16v280c0 13.25 10.75 24 24 24h168c75.11 0 136-60.89 136-136V48c0-8.84-7.16-16-16-16z" /></svg>
    </SvgIcon>
  )
}


const getOrderIcon = (orderType: Transaction_OT): JSX.Element => {
  let node = <></>;
  if (orderType.toUpperCase() === Transaction_OT.FLIGHT.toUpperCase()) {
    node = <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
      <Tooltip title={"Flight"}>
        <FlightIcon />
      </Tooltip>
    </Fab>
  }
  if (orderType.toUpperCase() === Transaction_OT.EXPENSE.toUpperCase()) {
    node = <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
      <Tooltip title={"Expense"}>
        <MiscellaneousServicesIcon />
      </Tooltip>
    </Fab>
  }
  if (orderType.toUpperCase() === Transaction_OT.MONTLY.toUpperCase()) {
    node = <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
      <Tooltip title={"Monthly Expense"}>
        <DashboardCustomizeOutlinedIcon />
      </Tooltip>
    </Fab>
  }
  if (orderType.toUpperCase() === Transaction_OT.OTHER.toUpperCase()) {
    node = <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
      <Tooltip title={"Other Operation"}>
        <MoreHorizOutlinedIcon />
      </Tooltip>
    </Fab>
  }
  if (orderType.toUpperCase() === Transaction_OT.ORDER.toUpperCase()) {
    node = <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
      <Tooltip title={"Order Done"}>
        <FlightIcon />
      </Tooltip>
    </Fab>
  }
  if (orderType.toUpperCase() === Transaction_OT.TRANSFER.toUpperCase()) {
    node = <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
      <Tooltip title={"Tranfer Money"}>
        <MonetizationOnIcon />
      </Tooltip>
    </Fab>
  }
  if (orderType.toUpperCase() === Transaction_OT.VARIABLE.toUpperCase()) {
    node = <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
      <Tooltip title={"Variable Expense"}>
        <PriceChangeOutlinedIcon />
      </Tooltip>
    </Fab>
  }

  if (orderType.toUpperCase() === Transaction_OT.REFUND.toUpperCase()) {
    node = <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
      <Tooltip title={"Refund Money"}>
        <MonetizationOnIcon />
      </Tooltip>
    </Fab>
  }
  return node;

}
const getIcon = (icon: string, percent: number = 1): JSX.Element => {
  let node = <></>;
  let size: number = percent;
  if (icon === "Shekel") {

    node = <Fab color='primary' sx={{ width: "40px", height: "40px", backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
      <Tooltip title={"Transaction Done"}>
        <>
          <svg width={size} height={size} viewBox={`0 0 ${24 * percent} ${24 * percent}`} xmlns="http://www.w3.org/2000/svg"><path d="M13 8v8h2V8c0-2.206-1.794-4-4-4H5v16h2V6h4c1.103 0 2 .897 2 2z" /><path d="M17 16c0 1.103-.897 2-2 2h-4V8H9v12h6c2.206 0 4-1.794 4-4V4h-2v12z" /></svg>
        </>

      </Tooltip>
    </Fab>
  }
  node = <Fab color='primary' sx={{ width: `${2 * size}px`, height: `${2 * size}px`, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
    <Tooltip title={"Transaction Done"}>
      <>
        <svg width={`${2 * size}px`} height={`${2 * size}px`} viewBox={`${-size / 2}px ${-size / 2}px ${size}px ${size}px`} xmlns="http://www.w3.org/2000/svg"><path d="M13 8v8h2V8c0-2.206-1.794-4-4-4H5v16h2V6h4c1.103 0 2 .897 2 2z" /><path d="M17 16c0 1.103-.897 2-2 2h-4V8H9v12h6c2.206 0 4-1.794 4-4V4h-2v12z" /></svg>
      </>

    </Tooltip>
  </Fab>;
  node = <Fab color='primary' sx={{ width: `${2 * size}px`, height: `${2 * size}px`, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
    <Tooltip title={"Transaction Done"}>
      <>
        <svg width={`${2 * size}px`} height={`${2 * size}px`} viewBox={`${-size / 2}px ${-size / 2}px ${size}px ${size}px`} xmlns="http://www.w3.org/2000/svg"><path d="M13 8v8h2V8c0-2.206-1.794-4-4-4H5v16h2V6h4c1.103 0 2 .897 2 2z" /><path d="M17 16c0 1.103-.897 2-2 2h-4V8H9v12h6c2.206 0 4-1.794 4-4V4h-2v12z" /></svg>
      </>

    </Tooltip>
  </Fab>;


  return node;

}
export const getSign = (val: number | undefined): string => {

  return (val !== undefined && val > 0) ? "green" : 'red'
}
export const getValue = (val: number | undefined): string => {

  return (val !== undefined && val > 0) ? "green" : 'red'
}
function MobileTransaction({ item, accountId }: MobileTransactionProps) {
  console.log("MobileTransaction/transaction,accountId", item, accountId)

  return (
    <Box margin={'0.5ch'}>
      <Accordion>
        <AccordionSummary>
          <Grid container sx={{ width: "100%", height: "100%" }} gap={0} justifyContent="space-around" columns={12}>
            <Grid item xs={2} alignSelf={"center"} justifySelf={"start"}>
              {getOrderIcon(item.order.type)}
            </Grid>
            <Grid item xs={8} sm={8}>
              <Grid>{item.source}</Grid>
              <Grid>{new Date(item.date).getDisplayDate()}</Grid>
              <Grid>{`${item.order.type}`}</Grid>
            </Grid>

            <Grid item xs={2} sm={2} alignItems={"center"} justifyItems={"left"}>
              <Box display={"flex"} alignSelf={"baseline"} justifyContent={"space-between"}>
                <Box display={"flex"} alignSelf={"baseline"} >
                  <>{"( "}</>
                  <ShekelIcon sx={{ fontSize: "0.7rem" }} />
                  <Typography style={{ color: CTransaction.getAccountSign(item, accountId) }}>{CTransaction.getAmount(item, accountId, true)}</Typography>
                  <>{" )"}</>
                </Box>
                <Box display={"flex"} alignSelf={"baseline"} >
                  <ShekelIcon sx={{ fontSize: "0.7rem" }} />
                  <Typography style={{ color: CTransaction.getAccountSign(item, accountId) }}>{CTransaction.getAmount(item, accountId)}</Typography>
                </Box>
              </Box>
            </Grid>

          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container sx={{ width: "100%", height: "100%" }} gap={0} justifyContent="space-around" columns={12}>
            <Grid item xs={4}>Source</Grid>
            <Grid item xs={8}>{item.source}</Grid>
            <Grid item xs={4}>Destination</Grid>
            <Grid item xs={8}>{item.destination}</Grid>
            <Grid item xs={4}>Operation</Grid>
            <Grid item xs={8}>{item.order.type}</Grid>
            <Grid item xs={4}>Order Ref</Grid>
            <Grid item xs={8}>{item.order._id}</Grid>
            <Grid item xs={4}>Payment by</Grid>
            <Grid item xs={8}>{item.payment.method}</Grid>
            <Grid item xs={4}>Payment referance</Grid>
            <Grid item xs={8}>{item.payment.referance}</Grid>
            <Grid item xs={4}>Description</Grid>
            <Grid item xs={8}>

              <Typography sx={{ wordBreak: "break-word" }}>
                {item.description}
              </Typography>
            </Grid>

          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default MobileTransaction