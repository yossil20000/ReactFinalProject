/* import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'; */
import React from 'react'
import { useFetchAllReservationsQuery } from '../../features/Reservations/reservationsApiSlice';

function ReservationsPage() {
  const {data ,isFetching} = useFetchAllReservationsQuery();
  console.log("ReservationsPage",data?.data)
  return (
    <div className='main'>
      <h1>Reservation</h1>
      
      {/* <LocalizationProvider dateAdapter={AdapterLuxon}></LocalizationProvider> */}
    </div>
  )
}

export default ReservationsPage