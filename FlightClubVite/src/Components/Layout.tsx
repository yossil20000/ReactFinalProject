import { Outlet } from 'react-router-dom'
import ResponsiveAppBar from '../Pages/Layout/AppBar'
import '../../src/App.css';
function Layout() {
  return (
    <div className='yl__container'>
      <div className='nav'>
        <ResponsiveAppBar />
      </div>
      <Outlet/>

    </div>
  )
}

export default Layout