import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import { storeUser } from './app/userStor';
import { CssBaseline } from '@mui/material'
import { CCustomLogger } from './customLogging'
globalThis.CustomLogger = new CCustomLogger({level: 'info'})
ReactDOM.createRoot(document.getElementById('root')!).render(
  //<Provider store={store}>
  <Provider store={storeUser}>
    <CssBaseline/>
      <App />
  </Provider>
  
  //</Provider>
)
