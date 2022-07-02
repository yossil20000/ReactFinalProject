import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

export default function TabHeader() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
    console.log("new value", newValue)
    
    switch(newValue){
      case 0:
        navigate('/home');
        break;
      case 1:
        navigate('/reservation');
        break;
    }
  };

  return (
    <Box sx={{ maxWidth: { xs: "100%", sm: "100%" }, bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        <Tab label="Home" />
        <Tab label="Reservation" />
        <Tab label="Order" />
        <Tab label="Admin" />
      </Tabs>
    </Box>
  );
}
