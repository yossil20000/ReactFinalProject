import '../../Types/date.extensions';
import { lightBlue, red ,grey} from '@mui/material/colors';
import { Box, Grid, Typography } from '@mui/material'

import { IDateFilter } from '../../Interfaces/IDateFilter';
import IReservation from '../../Interfaces/API/IReservation';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
export interface ICalanderViewProps {
  reservations?: IReservation[],
  title: string
}
interface IDateViewFilter extends IDateFilter {
  marked: boolean,
  hasDate: boolean,
  hourseDiff: number,
  title: string
}
const today = new Date();
const calander = Array(24).fill(1).map((_, i) => i + i * 0.5);
const time: IDateViewFilter[] = Array(3);
time[0] = { from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 2, 0, 0), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 4, 30, 0), marked: false, currentOffset: 0, hasDate: true, hourseDiff: 0 ,title: ""}
time[1] = { from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 4, 30, 0), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 5, 0, 0), marked: false, currentOffset: 0, hasDate: true, hourseDiff: 0 ,title: ""}
time[2] = { from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0, 0), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0), marked: false, currentOffset: 0, hasDate: true, hourseDiff: 0 ,title: ""}
time[3] = { from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30, 0), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 0, 0), marked: false, currentOffset: 0, hasDate: true, hourseDiff: 0 ,title: ""}
time[4] = { from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 30, 0), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 22, 0, 0), marked: false, currentOffset: 0, hasDate: true, hourseDiff: 0 ,title: ""}
console.log("calander", calander)
const x: number = 100 / 24;
const sortFrom = (a: IDateViewFilter, b: IDateViewFilter): number => {
  let result: number = 0;
  const compare = a.from.compareTime(b.from) 
  if (compare) result = 1;
  if (compare) result = 0;
  result = -1
  console.log("CalnanderViewDay/sortFrom", a, b, result);
  return result;
}
getDateRows(time);
function getDateRows(times: IDateViewFilter[]): IDateViewFilter[] {
  console.log("CalnanderViewDay/times", times);
  const sortedTimes = times.sort(sortFrom);
  let start: Date = (new Date()).getStartDayDate()
  console.log("CalnanderViewDay/sortedTimes", sortedTimes);
  let dateRows: IDateViewFilter[] = [];
  sortedTimes.forEach(element => {
    if (start.compareTime(element.from) < 0) {
      let newRow: IDateViewFilter = {
        from: start,
        to: element.from,
        hasDate: false,
        currentOffset: 0,
        marked: false,
        hourseDiff: Math.abs(start.getHoursDiff(element.from)),
        title: ""
      }
      dateRows.push(newRow)
    }
    element.hourseDiff = Math.abs(element.from.getHoursDiff(element.to))
    dateRows.push(element);
    start = element.to;


  });
  if (start.compareTime(start.getEndDayDate()) < 0 ) {
    let newRow: IDateViewFilter = {
      from: start,
      to: start.getEndDayDate(),
      hasDate: false,
      currentOffset: 0,
      marked: false,
      hourseDiff: Math.abs(start.getHoursDiff(start.getEndDayDate())),
      title: "valid"
    }
    dateRows.push(newRow)
  }
  console.log("CalnanderViewDay/dateRows", dateRows)
  return dateRows;

}
/* function get(): JSX.Element {
  const found = time.sort(sortFrom);
  const start : Date = (new Date()).getStartDayDate()

  console.log(found)
  if (found) {
    
    return (
      <Grid item xs={9} width={"100%"} height={`${x}%`} style={{ background: 'gray' }}>
        <Box sx={{ background: 'green', height: "100%" }}>{`from ${found.from} ${found.to}`}</Box>
      </Grid>
    )
  }

  return (
    <Grid item xs={9} width={"100%"} height={`${x}%`} style={{ background: 'red' }}>
      <Box sx={{ background: 'red', height: "100%" }}>{'free'}</Box>
    </Grid>
  )
} */



function CalnanderViewDay({ reservations,title="Reservation date" }: ICalanderViewProps) {
  const theme = useTheme()
  const viewDataFromReservation = useMemo(() => {
    let viewData: IDateViewFilter[] = []
    console.log("CalnanderViewDay/reservations",reservations)
    if (reservations !== undefined && Array.isArray(reservations)) {
        reservations.forEach((element) => {

          const from = new Date(element.date_from)
          const to = new Date (element.date_to);
          let data: IDateViewFilter ={
            marked: false,
            hasDate: true,
            hourseDiff: Math.abs(from.getHoursDiff(to)),
            from: from,
            to: to,
            currentOffset: 0,
            title: `${from.getLocal24Hours()} ${to.getLocal24Hours()} ${element.member.family_name}`
          }
          viewData.push(data);
        })
    }
    return viewData;
  }, [reservations])

  return (
    <>
      {/* <div className='header'>"Header"</div> */}
     {/*  <div className='main' style={{ width: "100%" }}> */}
        <Grid width={"100%"} height={"100%"} container columns={12}>
          <Grid item xs={12}><Typography textAlign={'center'}>{title}</Typography></Grid>
          {getDateRows(viewDataFromReservation).map((i, index) => (
            <>
              <Grid item xs={3} width={"100%"} maxHeight={`${i.hourseDiff * x}%`} style={{ minHeight: "2ch"}}>
                <Box height={'100%'} display={'flex'} flexDirection={'column'} alignContent={'space-between'} sx={{ background: theme?.palette.info.light, height: "100%" }}>
                  <div style={{height: '100%'}}>{i.from.getLocal24Hours()}</div>
                  {/* <div >{i.to.getLocal24Hours()}</div> */}
                </Box>
              </Grid>
              <Grid item xs={9} width={"100%"} height={`${i.hourseDiff * x}%`} style={{ minHeight: "2ch" }}>
                <Box sx={{ background: i.hasDate ? lightBlue[100] : grey[300], height: "100%" }}>{i.hasDate? i.title: ""}</Box>
              </Grid>
            </>
          ))

          }

        </Grid>
     {/*  </div> */}

    </>

  )
}

export default CalnanderViewDay