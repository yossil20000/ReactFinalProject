
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { useGetAllFlightsQuery } from "../../features/Flight/flightApi";
import IFlight from "../../Interfaces/API/IFlight";
import Message from '../../Components/Message'
import { grid } from "@mui/system";

import SortButtons, {ISortButtonsProps,ISortCell,Order} from "../../Components/Buttons/sortButtons";
import GeneralCanDo, { CanDo } from "../../Utils/owner";
import { useAppSelector } from "../../app/hooks";
import { ILoginResult } from "../../Interfaces/API/ILogin";

interface IFlightData {
  _id: string; _id_member: string; name: string;
  device_id: string; date_from: Date; date_to: Date; member_id: string; validOperation: CanDo;
  hobbs_start: number; hobbs_stop: number; engien_start: number;engien_stop: number;
}

function createdata(flight: IFlight, validOperation: CanDo) : IFlightData{
return {_id: flight._id,_id_member: flight.member._id,
  name: flight.member.family_name, device_id:flight.device.device_id,
date_from:  flight.date_from, date_to: flight.date_to, member_id: flight.member.member_id,
hobbs_start: flight.hobbs_start,hobbs_stop: flight.hobbs_stop, engien_start: flight.engien_start,engien_stop: flight.engien_stop,
validOperation: validOperation}
}


const sortCells:  ISortCell<IFlightData>[] = [
  { id: "_id", label: "Device", numeric: false },
  { id: "date_from", label: "From", numeric: false },
  { id: "date_to", label: "To", numeric: false },
  { id: "name", label: "Name", numeric: false },
  { id: "member_id", label: "IdNumber", numeric: false },


]
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | Date | boolean },
  b: { [key in Key]: number | string | Date | boolean },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  /* console.log("descendingComparator", a, b, orderBy) */
  if (b[orderBy] < a[orderBy]) { return -1 }
  if (b[orderBy] > a[orderBy]) { return 1 }
  return 0;
}
const FlightPage = () => {
  
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof IFlightData>("_id");
  const [flightsData,setFilghtData] = useState<IFlightData[]>([]);
  const [expanded, setExpanded] = useState<string | false>('panel0');
  const login: ILoginResult = useAppSelector((state) => state.authSlice);
  const { isLoading, isError, isSuccess, error, data: flights } = useGetAllFlightsQuery();
  function getFlightData(flights: IFlight[]): IFlightData[]{
    return flights.map((flight) => createdata(flight,GeneralCanDo(flight.member._id, login.member._id, login.member.roles)))
  }
  useEffect(() => {
    if (isError) {
      console.log("FlightPage/useEffect/error", (error as any));
    }

  }, [isLoading]);
  useEffect(()=> {
    if(flights?.data !== undefined)
      setFilghtData(getFlightData(flights?.data));
  },[flights?.data])
  if (isLoading) {
    return (
      <div className='main' style={{ overflow: 'auto' }}>
        <FullScreenLoader />
      </div>
    )
  }
  if(flights !== undefined || flights !== null){
    console.log("Flights", flights);
  }
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IFlightData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  const n="repeat(5,1fr)";
  
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
    const handleEditClick = async (event: React.MouseEvent<unknown>, _id: string) => {
      /* SetReservationUpdate(_id);
      setIsReservationUpdate(true); */
    }
    const handleDeleteClick = async (event: React.MouseEvent<unknown>, _id: string) => {
     /*  const reservationDelete: IReservationDelete = {
        _id: _id
      } */
      console.log("Delete /", _id);
      try {
        /* const payload = await DeleteReservation(reservationDelete)
          .unwrap()
          .then((payload) => {
            console.log("DeleteReservation Fullfill", payload)
            refetch();
          }); */
      }
      catch (err) {
        console.log("DeleteReservation/err", err)
      }
    }
  return (
    <div className='main' style={{ overflow: 'auto' }}>
      
      <Box sx={{ width: '100%', height: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
        <SortButtons  sortCells={sortCells} onRequestSort={handleRequestSort} order={order} orderBy={orderBy}  />       
        {
          flightsData?.sort(getComparator(order, orderBy)).map((row : IFlightData, index: number) => {
            return (
              <Accordion key={row._id} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Typography variant='caption'> {row.device_id} , {new Date(row.date_from).toLocaleString()} {"=>"} {new Date(row.date_to).toLocaleString()}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  <Grid item xs={3} >
             
                    <Typography >
                      {row.name}
                    </Typography>
                    <Typography>
                      {row.member_id}
                    </Typography>
                  </Grid>
                  <Grid item sm={4} >
                    <Typography>
                      {`Hobbs Start: ${row.hobbs_start}`}
                    </Typography>
                    <Typography>
                    {`Hobbs Stop: ${row.hobbs_stop}`}
                    </Typography>
                  </Grid>
                  <Grid item sm={4} >
                    <Typography>
                      {`Engien Start: ${row.engien_start}`}
                    </Typography>
                    <Typography>
                    {`Engien Stop: ${row.engien_stop}`}
                    </Typography>
                    
                  </Grid>
                  <Grid item sm={1} >
                    <Typography>
                    {(row.validOperation & CanDo.Edit) ? <Button onClick={(event) => handleEditClick(event, row._id)}>Edit</Button> : null}
                    </Typography>
                    <Typography>
                    {(row.validOperation & CanDo.Delete) ? <Button onClick={(event) => handleDeleteClick(event, row._id)}>Delete</Button> : null}
                    </Typography>

                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            )
          })
          }
        </Paper>
      </Box>
    </div>
  )
}
export default FlightPage;