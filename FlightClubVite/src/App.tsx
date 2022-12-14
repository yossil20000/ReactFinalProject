
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { NoticeContext } from './app/Context/NoticeContext';
import { useAppDispatch } from './app/hooks';
import { LOCAL_STORAGE } from './Enums/localStroage';
import { setCredentials } from './features/Auth/authSlice';
import { useFetchAllNoticesQuery } from './features/clubNotice/noticeApiSlice';
import useLocalStorage from './hooks/useLocalStorage';
import IClubNotice, { NewNotice } from './Interfaces/API/IClubNotice';
import { ILoginResult } from './Interfaces/API/ILogin';
import { Role } from './Interfaces/API/IMember';
import { PagesRouter } from './Router/Router';
import { getFromLocalStorage } from './Utils/localStorage';
export function LocalStorage() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        let login_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);
        if (login_info === "") {
            login_info = {
                "access_token": "",
                "exp": 0,
                "iat": "",
                "expDate": "",
                "message": "",
                "member": {
                    _id: "",
                    member_id: "",
                    family_name: "guset",
                    first_name: "user",
                    roles: [Role.guest],
                    email: "",
                    username:""
                }
            }
        }
        dispatch(setCredentials(login_info as ILoginResult));
    }, [])
    return (
        null
    )

}

function App() {
    const {isError,isLoading,isSuccess,isFetching,error,data} = useFetchAllNoticesQuery();
    const [notices,setNotices] = useState<IClubNotice[]>([])
    const [selectedNotice,setSelectedNotice] = useLocalStorage<IClubNotice | null| undefined>("_Notice/selected",NewNotice)
  
     useEffect(() => {
      console.log("HomePage/isLoading", isLoading)
    },[isLoading]) 
  
    useEffect(() => {
      console.log("HomePage/data", data)
      if(data?.data !== undefined && data?.data !== null){
        setNotices(data.data)
        console.log("HomePage/setNotices", data.data)
      }
          },[data])
  
    return (
        <BrowserRouter>
        <NoticeContext.Provider value={{notices:notices ,selectedItem: selectedNotice ?? NewNotice, setSelectedItem:setSelectedNotice}}>

        
            <PagesRouter />
        </NoticeContext.Provider>
        </BrowserRouter>
    )

}

export default App
