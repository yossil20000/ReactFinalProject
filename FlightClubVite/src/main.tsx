import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { LocalStorage } from './App'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { storeUser } from './app/userStor';

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<Provider store={store}>
  <React.StrictMode>
  <Provider store={storeUser}>
      <App />
  </Provider>
  </React.StrictMode>
  //</Provider>
)
