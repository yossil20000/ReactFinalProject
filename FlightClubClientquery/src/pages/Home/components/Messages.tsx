import { title } from "process";
import { useEffect, useState } from "react";
import { useQuery } from "react-query"
import ClubMessagesService from "../../../api/services/ClubMessages/ClubMessagesService"
import { ClubMessage } from "../../../Types/ClubMessages"



export function Messages() {
  const [result, setResult] = useState<ClubMessage[] | null>(null)
 const {isLoading, data,error,status} = useQuery<ClubMessage[],Error>(
  "ClubMessages",
  async () => {
    
    const data = await ClubMessagesService.getAll()
    console.log("Data Messages", data);
    setResult(data);
    return data;
  }
  
 );
 function NumberList() {
  const listItems = data?.map((item,i) =>
    <li key={i}>{item.title}</li>
  );
  return (
    <ul >{listItems}</ul>
  );
}

 console.log("Render",error,isLoading,data,status)
 if(error != null && error.message != "")  (<div>Error:{error.message}</div>)
  if(isLoading) return (<div>Loading</div>)
  if(data && data?.length > 0){
    return NumberList();
    
    
  }
   
  
  
 /* const MessagesComponent = ({title,description}:  ClubMessage) => ( <div>ClubMessage:{title ? title : "title"} , {description ?  description : "description"}</div>) */
  return (<div>error</div>)
}

