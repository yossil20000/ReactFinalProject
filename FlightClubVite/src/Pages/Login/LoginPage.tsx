import '../../Types/date.extensions'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLoginMutation } from '../../features/Auth/authApiSlice'
import ILogin, { ILoginResult } from '../../Interfaces/API/ILogin';
import { setCredentials, selectCurrentId } from "../../features/Auth/authSlice"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useNavigate, useLocation } from 'react-router-dom';
import { getFromLocalStorage } from '../../Utils/localStorage';
import { LOCAL_STORAGE } from '../../Enums/localStroage';
import { Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import VersionHistory, { IVersionHistoryProps } from './VersionHistory';
import { width } from '@mui/system';


function Copyright({ show: showVersion }: IVersionHistoryProps) {

  return (
    <Box width={"100%"}>

      <VersionHistory show={showVersion} />
      <Typography variant="body2" color="text.secondary" align="center" >
        {'Copyright © '}
        <Link color="inherit" href="#">
          Yosef Levy
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>

  );
}
const theme = createTheme();

export default function LoginPage() {

  const [loging] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/home" } };

  const [loginError, setLoginError] = React.useState<string[]>([]);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showVersion, setShowVersion] = React.useState(false);
  const id = useAppSelector((state) => state.authSlice.member._id);
  CustomLogger.log("id", id)
  CustomLogger.log("id", selectCurrentId)
  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoginError([]);
    CustomLogger.info({
      email: data.get('email'),
      password: data.get('password')/* ,
      resend: data.get('resend') */
    });
    const loginProps: ILogin = {
      password: data.get('password')?.toString() === undefined ? "" : data.get('password')?.toString(),
      email: data.get('email')?.toString() === undefined ? "" : data.get('email')?.toString(),
      username: data.get('username')?.toString() === undefined ? "" : data.get('username')?.toString(),
      /* resend: data.get('resend')?.toString()  === undefined ? false : true */
    }
    try {
      const payload = await loging(loginProps)
        .unwrap()
        .then((payload) => {
          CustomLogger.info('fullfil', payload);
          let loging_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);
          CustomLogger.info("localStorage:before", loging_info);
          dispatch(setCredentials(payload.data));
          /* setLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO, payload.data); */
          loging_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);

          CustomLogger.info("localStorage", loging_info);
          /* navigate(`/${ROUTES.HOME}`); */
          navigate(from, { replace: true })
        })
        .catch((err) => {
          CustomLogger.error("rejected", err);
          setLoginError(err.data.errors);
          CustomLogger.error("loginerr", loginError);

        });
    }
    catch (err) {
      CustomLogger.error("submitForm/login: err");
    }
  };
  function renderError() {
    return (
      <ol>
        {loginError.map((err) => (
          <li>{err}</li>
        ))}
      </ol>
    );
  }
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <>

      <ThemeProvider theme={theme}>
        <Container component="main" style={{ overflow: "auto" }}>
          <CssBaseline />
          {showVersion == false ?
            (
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
                <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ mt: 1 }}>
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
                    id="username"
                    label="Username"
                    name="username"

                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    InputProps={{
                      endAdornment: <InputAdornment position="start">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>,
                    }}
                  />
                  {renderError()}
                  {/*               <FormControlLabel
              control={<Checkbox value={true} color="primary" name='resend' />}
              label="Resend"
            /> */}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs={12}>
                      <Link href="/reset" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            ) :
            (
              <Copyright show={true} />
            )}

          <Grid container>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" align="center" >

                <FormControlLabel control={<Checkbox onChange={() => { setShowVersion(!showVersion) }}
                  name={"active_only"} checked={showVersion}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />}
                  label={showVersion ? "Hide Version History" : "Show Version History"} />
              </Typography>
            </Grid>
          </Grid>

        </Container>
      </ThemeProvider>
    </>
  )
}
