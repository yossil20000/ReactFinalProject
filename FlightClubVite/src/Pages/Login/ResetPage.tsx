
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ClassNames } from '@emotion/react';
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import {useResetMutation} from '../../features/Auth/authApiSlice'
import {IReset,IResetResult} from '../../Interfaces/API/ILogin';
import { ROUTES } from '../../Types/Urls';
import { useState } from 'react';
const theme = createTheme();
export default function ResetPage() {
  const navigate = useNavigate();
  
  const [reset,result]= useResetMutation();
  const [isReset,setIsReset] = useState(false)
  let resetProps : IReset = {
    email:  ""
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email')
    });
    resetProps.email =  data.get('email')?.toString() ===  undefined ? "" : data.get('email')?.toString() ;
    try{
      const paload = await reset(resetProps).unwrap();
      
      
      if(paload.success){
        console.log("Unwrap", paload.data.newPassword);
        console.log("resetProps" , resetProps.email)
        setIsReset(true);
      }
    }
    catch(err)
    {
      console.log("submitForm/reset: err", err);
    }
    console.log("ResetPageResult" , result)
  };
 
  
  const renderReset = () => {
    if(!isReset){
      return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Send To Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset
              </Button>
              
            </Box>
          </Box>
          
        </Container>
      </ThemeProvider>
      )
    }
    else {
      navigate(`/${ROUTES.CHANGE_PASSWORD}`)
      return (
        <div>
          Yor Reset Password sent to email:{resetProps.email}
        </div>
      )
    }
  }
  return (
    <div className='main'>
      {renderReset()}

        
    </div>
  )
}
