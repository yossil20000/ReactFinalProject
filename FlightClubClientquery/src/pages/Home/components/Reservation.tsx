import React from 'react'
import { useQuery } from 'react-query';
import ReservationService from '../../../api/services/Reservation/ReservationService';
import IFlightReservation from '../../../Interfaces/API/IFlightReservation';

function Reservation() {
    const {isLoading, data,error,status} = useQuery<IFlightReservation[],Error>(
        "FlighReservation",
        async () => {
          
          const data = await ReservationService.getAll()
          console.log("Data Reservation", data);
         
          return data;
        }
        
       );
  return (
    <div>Reservation</div>
  )
}

export default Reservation