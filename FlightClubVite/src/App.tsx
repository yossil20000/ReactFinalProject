
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { useAppDispatch } from './app/hooks';
import { LOCAL_STORAGE } from './Enums/localStroage';
import { setCredentials } from './features/Auth/authSlice';
import { ILoginResult } from './Interfaces/API/ILogin';
import { Role } from './Interfaces/API/IMember';
import ResponsiveAppBar from './Pages/Layout/AppBar';
import { PagesRouter } from './Router/Router';
import { getMembersAndDevicesCombo } from './Utils/fetchData';
import { getFromLocalStorage } from './Utils/localStorage';
getMembersAndDevicesCombo();
function App() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        let login_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);
        if(login_info === "")
        {
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
                    roles:[Role.guest],
                    email: ""
                }
            }
        }
        dispatch(setCredentials(login_info as ILoginResult));
    },[])
    return (
        <BrowserRouter>
            <div className='yl__container'>
                <div className='nav'>
                    <ResponsiveAppBar />
                </div>
                
                <PagesRouter />
            </div>
        </BrowserRouter>
    )

}

export default App
