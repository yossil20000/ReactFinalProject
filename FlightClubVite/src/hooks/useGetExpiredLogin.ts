import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useAppSelector } from "../app/hooks";
export default function useGetExpiredLogin()  {
  const login = useAppSelector((state) => state.authSlice);
  const [remainLogin,setRemainLogin] = useState<number>(0);
  useEffect(() => {
    let remainLoginInterval = setInterval(() => {
      globalThis.CustomLogger.log("useGetExpiredLogin",login)
      if(login?.expDate !== undefined)
      {
        const currentDate = DateTime.now();
        const dateExpired = DateTime.fromJSDate(new Date(login?.expDate))
        const remain = dateExpired.toUnixInteger() - currentDate.toUnixInteger();
        setRemainLogin(remain)
        CustomLogger.log("useGetExpiredLogin/remainLogin",remainLogin,remain)
      }
    },1000)
    return () => {
      clearInterval(remainLoginInterval);
    };
   
  })
 return remainLogin
}