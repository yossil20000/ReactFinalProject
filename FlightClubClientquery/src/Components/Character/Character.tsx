import { useQuery } from "react-query";
import CharacterService from '../../api/services/character/getCaharcter'
import Character from "../../Interfaces/Character/Character";

function CharacterApp() {
  const { isLoading: isLoadingCharacter,data} = useQuery<Character, Error>(
    "character",
    async () => {
      return CharacterService.getByid(1);
    },
    {
      enabled: true,
      retry: 1,
      onSuccess: (res) => {
        console.log(res)
      },
      onError: (err: any) => {
        console.log(err)
    },
  }
  );
  return (
    <div>
      <h2>Characters</h2>
      {
      isLoadingCharacter ? "loading characters" : "loaded"
        
      }
      <h3>Naame{data?.name}</h3>
    </div>
  )
}

export default CharacterApp




