import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IChangePassword } from '../../Interfaces/API/ILogin';
import { useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Types/Urls';
import PasswordButton from '../../Components/Buttons/PasswordButton';
import checkPassword, { checkUsername } from '../../Utils/registerUtils';
import { useChangePasswordMutation } from '../../features/Auth/authApiSlice';
const theme = createTheme();

function ChangePassword() {
  const login = useAppSelector((state) => state.authSlice);
  const initChangePassword: IChangePassword = {
    username: login.member.username,
    password: "",
    newPassword: ""
  }
  const navigate = useNavigate();
  const [changePasswordApi] = useChangePasswordMutation();
  const [verifypassword,setVerifyPassword] = useState("");
  const [changePassword,setChangePassword] = useState<IChangePassword>(initChangePassword)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("handleSubmit/",changePassword);
    const result = await changePasswordApi(changePassword).unwrap();
    console.log("handleSubmit/result", result);
  };

  const handleVerifyPassword =  (prop: any) => (event: any) => {
    event.preventDefault();
    console.log("ChangePassword/handleVerifyPassword/props_event", prop,event)
    setVerifyPassword(event.target.value)
    
    return {}
  };
  const handleChange =  (prop: any) => (event: any) => {
    event.preventDefault();
    console.log("ChangePassword/hadleChanged/props_event", prop,event)
    setChangePassword((prev) => ({...prev,[prop]: event.target.value}))
    return {}
  };
  const RenderChangePassword = () => {
    console.log("RenderChangePassword/login",login)
    if (login.member.username)
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
                Change Password
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <PasswordButton property="username" value={changePassword.username === undefined ? "" : changePassword.username} handleChange={handleChange} isValid={checkUsername(changePassword.username)} label="Username" />
                <PasswordButton property="password" value={changePassword.password === undefined ? "" : changePassword.password} handleChange={handleChange} isValid={checkUsername(changePassword.username)} label="Password" />
                <PasswordButton property="newPassword" value={changePassword.newPassword === undefined ? "" : changePassword.newPassword} handleChange={handleChange} isValid={checkPassword(changePassword.newPassword,verifypassword)} label="New Password" />
                <PasswordButton property="verifypassword" value={verifypassword === undefined ? "" : verifypassword} handleChange={handleVerifyPassword} isValid={checkPassword(changePassword.newPassword,verifypassword)} label="Validate Password" />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Change Password
                </Button>
              </Box>
            </Box>

          </Container>
        </ThemeProvider>
      )
    else {
      navigate(`/${ROUTES.LOGIN}`)
      return (
        <div>
          Yor Reset Password sent to email:
        </div>
      )
    }
  }
  useEffect(() => {
    if(login.member.username === ""){
      navigate(`/${ROUTES.LOGIN}`)
    }
  },[login])
  return (
    <div className='main'>
      {RenderChangePassword()}
    </div>
  )
}

export default ChangePassword