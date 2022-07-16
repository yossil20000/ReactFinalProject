
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import ResponsiveAppBar from './Pages/Layout/AppBar';
import { PagesRouter } from './Router/Router';

function App() {
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
