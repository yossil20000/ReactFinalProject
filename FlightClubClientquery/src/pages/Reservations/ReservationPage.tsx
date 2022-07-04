import React from 'react'
import { useQuery } from 'react-query';
import ReservationService from '../../api/services/Reservation/ReservationService';
import IFlightReservation from '../../Interfaces/API/IFlightReservation';
import Reservation from './Reservation/Reservation'

function ReservationPage() {
  const headers = {
    from: "From",
    to: "To",
    name: "Name",
    device: "Device",
  }
  const sorters = {
    name: true,
    date: true,
    device: true,
  }
  const {isLoading, data,error,status} = useQuery<IFlightReservation[],Error>(
    "FlighReservation",
    async () => {
      
      const data = await ReservationService.getAll() as IFlightReservation[]
      console.log("Data Reservation", data);
      return data;
      
    }
    
   );
  return (
    <div className="main">Reservation
     <Reservation headers={headers} rows={data} sorters={sorters}></Reservation> 
    </div>
  )
}

export default ReservationPage