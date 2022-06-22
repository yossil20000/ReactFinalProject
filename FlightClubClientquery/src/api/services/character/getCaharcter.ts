
import axios from 'axios';
import Character from '../../../Interfaces/Character/Character';
const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
      "Content-type": "application/json",
    },
  });


function assertIsCharacter(character : any) : asserts character is Character{
    if(!("name" in character)){
        throw new Error("Not character ");
    }
}


const getAll =  async  () => {
   
    const response = await apiClient.get<Character[]>(`https://swapi.dev/api/people`);
    console.log("Response", response.data);
    
    return response.data;
  }
 const getByid =  async  (id:any) => {
   
    const response = await apiClient.get<Character>(`https://swapi.dev/api/people/${id}`);
    console.log("Response", response.data);
    
    return response.data;
  }

  const CharacterService = {
    getByid,
    getAll
  }
  export default CharacterService;