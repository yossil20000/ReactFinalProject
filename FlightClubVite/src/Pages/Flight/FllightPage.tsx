
import { Box, Container, Grid } from "@mui/material";
import { useEffect } from "react";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { useGetAllFlightsQuery } from "../../features/Flight/flightApi";
import IFlight from "../../Interfaces/API/IFlight";
import Message from '../../Components/Message'
const FlightPage = () => {
  const { isLoading, isError, isSuccess, error, data: flights } = useGetAllFlightsQuery();
  useEffect(() => {
    if (isError) {
      console.log("FlightPage/useEffect/error", (error as any));
    }

  }, [isLoading])
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
  return (
    <div className='main' style={{ overflow: 'auto' }}>
    <Container
      maxWidth={false}
      sx={{ backgroundColor: '#2363eb', height: '100vh' }}
    >
      {flights?.data.length === 0 ? (
        <Box maxWidth='sm' sx={{ mx: 'auto', py: '5rem' }}>
          <Message type='info' title='Info'>
            No flights at the moment
          </Message>
        </Box>
      ) : (
        <Grid
          container
          rowGap={5}
          maxWidth='lg'
          sx={{
            margin: '0 auto',
            py: '5rem',
            gridAutoRows: 'max-content',
          }}
        >
          {flights?.data?.map((flight : IFlight) => (
            <li>{flight.engien_start} {flight.device.device_id}</li>
          ))}
        </Grid>
      )}
    </Container>
    </div>
  )
}
export default FlightPage;