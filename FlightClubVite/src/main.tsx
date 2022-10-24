import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { LocalStorage } from './App'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { storeUser } from './app/userStor';
import { CssBaseline } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<Provider store={store}>
  <Provider store={storeUser}>
    <CssBaseline/>
      <App />
  </Provider>
  
  //</Provider>
)
