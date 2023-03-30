import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useAppSelector } from "../app/hooks";

export default function useGetExpiredLogin()  {
  const login = useAppSelector((state) => state.authSlice);
  console.log("useGetExpiredLogin")
  const [remainLogin,setRemainLogin] = useState<number>(0);
  useEffect(() => {
    let remainLoginInterval = setInterval(() => {
      console.log("useGetExpiredLogin1",login)
      if(login?.expDate !== undefined)
      {
        console.log("useGetExpiredLogin1")
        const currentDate = DateTime.now();
        const dateExpired = DateTime.fromJSDate(new Date(login?.expDate))
        console.log("useGetExpiredLogin2",dateExpired,currentDate,remainLogin)
        const remain = dateExpired.toUnixInteger() - currentDate.toUnixInteger();
        setRemainLogin(remain)
        console.log("useGetExpiredLogin3",remainLogin,remain)
      }
      
    },1000)
    return () => {
      clearInterval(remainLoginInterval);
    };
   
  })
 return remainLogin
}