import * as React from 'react';
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
import {useLoginMutation} from '../../features/Auth/authApiSlice'
import ILogin, { ILoginResult } from '../../Interfaces/API/ILogin';
import {setCredentials,selectCurrentUser,selectCurrentId} from "../../features/Auth/authSlice"
import {useAppDispatch,useAppSelector} from '../../app/hooks'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Types/Urls';
import { getFromLocalStorage, setLocalStorage } from '../../Utils/localStorage';
import { LOCAL_STORAGE } from '../../Enums/localStroage';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        Yosef Levy
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
const theme = createTheme();

export default function LoginPage() {
  const navigate = useNavigate();
  const [loging]= useLoginMutation();
  const dispatch = useAppDispatch();
  const [loginError,setLoginError] = React.useState<string[]>([]);
  const id = useAppSelector((state) => state.authSlice.member._id);
  console.log("id", id)
  console.log("id", selectCurrentId)
  const handleSubmit1 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoginError([]);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    const loginProps : ILogin = {
      password: data.get('password')?.toString() ===  undefined ? "" : data.get('password')?.toString() ,
      email:  data.get('email')?.toString() === undefined ? "" : data.get('email')?.toString() ,
    }
    try{
      const payload = await loging(loginProps)
      .unwrap()
      .then((payload) => {
        console.log('fullfil' , payload);
        let loging_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);
        console.log("localStorage:before", loging_info);
        dispatch(setCredentials(payload.data));
        setLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO,payload.data);
        loging_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);

        console.log("localStorage", loging_info);
        navigate(`/${ROUTES.HOME}`);
    })
      .catch((err) => {console.log("rejected",err);
      setLoginError(err.data.errors);
      console.log("loginerr", loginError);
      
    });
      //dispatch(setCredentials(payload));
      
      //console.log("Unwrap", payload.data);
      
    }
    catch(err)
    {
      console.log("submitForm/login: err");

    }
    //console.log("LogingPageResult" , result)
  };
  function renderError() {
    const reptiles = ["alligator", "snake", "lizard"];
  
    return (
      <ol>
        {loginError.map((err) => (
          <li>{err}</li>
        ))}
      </ol>
    );
  }
  return (
    <div className='main'>

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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit1} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            { renderError()}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/registration" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    </div>
  )
}
