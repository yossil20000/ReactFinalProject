
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { useAppDispatch } from './app/hooks';
import { LOCAL_STORAGE } from './Enums/localStroage';
import { setCredentials } from './features/Auth/authSlice';
import { ILoginResult } from './Interfaces/API/ILogin';
import ResponsiveAppBar from './Pages/Layout/AppBar';
import { PagesRouter } from './Router/Router';
import { getFromLocalStorage } from './Utils/localStorage';

function App() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        let login_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);
        dispatch(setCredentials(login_info as ILoginResult));
    },[])
    return(
        <BrowserRouter>
        <div className='yl__container'>
            <div className='nav'>
                <ResponsiveAppBar/>
                            </div>
            <div className='header'>header</div>
            <PagesRouter/>
            <footer className='footer'>Footer</footer>
        </div>
        </BrowserRouter>
    )

}

export default App
