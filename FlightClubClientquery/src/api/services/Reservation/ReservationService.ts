import axios from 'axios'
import IFlightReservation from '../../../Interfaces/API/IFlightReservation'

const apiclient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_ADDRESS,
    headers:{
        "Content-type": "application/json",
    }
});

const getAll = async () => {
    const response = await apiclient.get("http://localhost:3002/reservation")
    for(let i=0; i< response.data.length;i++)
    {
      console.log("tirle", response.data.data[i]);
    }
    return response.data.data;
}
const ReservationService = {
    getAll
  }
export default ReservationService;