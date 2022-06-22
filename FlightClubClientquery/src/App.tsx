import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {Router as PageRouter} from './Router/Router';
import CharacterApp from './Components/Character/Character';
import Footer from './Components/Layout/Footer/Footer';
import Navigtion from './Components/Layout/Navigation/Navigation';
import TabHeader from './Components/Layout/Header/TabHeader';

console.log("process.env.REACT_APP_IS_AXIOS_MOCK",process.env.REACT_APP_IS_AXIOS_MOCK) // remove this after you've confirmed it working
console.log("process.env.REACT_APP_SERVER_BASE_ADDRESS",process.env.REACT_APP_SERVER_BASE_ADDRESS) // remove this after you've confirmed it working

function App() {
  return (
    <BrowserRouter>
    <div className='yl__container'>
      <Navigtion></Navigtion>
      <div className='header'><TabHeader></TabHeader></div>
      <PageRouter/>
      <Footer></Footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
