
import axios from 'axios';
import { ClubMessage } from '../../../Types/ClubMessages';
import { URLS } from '../../../Types/Urls';
import { CLUB_MESSAGE_ALL } from '../../Consts/Api';
const apiClient = axios.create({
    baseURL: process.env.SERVER_BASE_ADDRESS,
    headers: {
      "Content-type": "application/json",
    },
  });





const getAll =  async  () => {
   
    const response = await apiClient.get(`${URLS.SERVER_BASE_ADDRESS}/api/${CLUB_MESSAGE_ALL}`);
    console.log("Response getAll", response.data.data);
    for(let i=0; i< response.data.length;i++)
    {
      console.log("tirle", response.data.data[i]);
    }
    return response.data.data;
  }
 const getByid =  async  (id:any) => {
   
    const response = await apiClient.get<ClubMessage>(`https://swapi.dev/api/people/${id}`);
    console.log("Response", response.data);
    
    return response.data;
  }

  const ClubMessagesService = {
    getByid,
    getAll
  }
  export default ClubMessagesService;