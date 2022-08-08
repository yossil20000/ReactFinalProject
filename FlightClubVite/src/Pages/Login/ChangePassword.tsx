import React, { useState } from 'react'
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
import { IChangePassword } from '../../Interfaces/API/ILogin';
const theme = createTheme();

function ChangePassword() {
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    const changePassword : IChangePassword = {
      currentPassword: data.get('currentPassword')?.toString() === undefined ? "" : data.get('currentPassword')?.toString(),
      newPassword: data.get('password')?.toString() === undefined ? "" : data.get('password')?.toString()
    }
    
  };
  const isValid = () => {
    setIsValidPassword(password == verifyPassword);
  }
  const checkPassword = (value: any) => {
    setPassword(value)
    isValid();
  }
  const checkVerifyPassword = (value: any) => {
    setVerifyPassword(value)
    isValid();
  }
  const RenderChangePassword = () => {
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="currentPassword"
              label="Current Password"
              name="currentPassword"
              autoComplete="currentPassword"
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
              autoComplete="password"
              onChange={(e) => checkPassword(e.target.value)}
              value={password}
            />
             <TextField
              margin="normal"
              required
              fullWidth
              name="verifypassword"
              label="Verify Password"
              type="password"
              id="verifypassword"
              autoComplete="verifypassword"
              value={verifyPassword}
              onChange={(e) => checkVerifyPassword(e.target.value)}
              helperText= {isValidPassword ? "error" : "valid"}
            />
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
  }
  return (
    <div className='main'>
{RenderChangePassword()}
    </div>
  )
}

export default ChangePassword