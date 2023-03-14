import { Outlet } from 'react-router-dom'
import ResponsiveAppBar from '../Pages/Layout/AppBar'
import '../../src/App.css';
import { Box } from '@mui/material';
function Layout() {
  return (
    <Box display={'flex'} flexDirection={'column'} position={'relative'} height={"100vh"} width={"100vw"} overflow={'hidden'}>
      <Box position={'absolute'} top={0} height={'10%'} width={'100%'} display={'flex'} flexDirection={'column'}>
        <ResponsiveAppBar />
      </Box>
      <Box  position={'absolute'} top={"9%"} height={'90%'} width={'100%'} display={'flex'} flexDirection={'column'} overflow={'hidden'}>
      <Outlet />
      </Box>

    </Box>

  )
}

export default Layout