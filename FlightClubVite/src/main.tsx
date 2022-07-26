import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {Provider} from 'react-redux'
import {store} from './app/store'
import {storeUser} from './app/userStor';
import {store1} from './app/store1'
ReactDOM.createRoot(document.getElementById('root')!).render(
//<Provider store={store}>
  <Provider store={storeUser}>
<React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>
//</Provider>
)
