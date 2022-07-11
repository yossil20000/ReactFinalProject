import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { PagesRouter } from './Router/Router';

function App() {
    return(
        <BrowserRouter>
        <div className='yl__container'>
            <nav className='nav'>Nav</nav>
            <header className='header'>Header</header>
            <PagesRouter/>
            <footer className='footer'>Footer</footer>
        </div>
        </BrowserRouter>
    )

}

export default App
