import { Box, Button, FormControl, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Paper, Typography } from '@mui/material';
import { useState } from 'react'
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IMemberCreate from '../../Interfaces/IMemberCreate';
import checkPassword, { checkUsername, IValidation } from '../../Utils/registerUtils';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const defaultCheckPassword: IValidation = {
    valid: false,
    validation: []
}
function Register({ numPage, page, setPage, formData, setFormData }: IPageNavigate<IMemberCreate>) {
    const [verifiedPassword, setVerifiedPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState<IValidation>(defaultCheckPassword);
    const [isusernameValid, setIsUsernameValid] = useState<IValidation>(defaultCheckPassword);
    const handleChange = (prop: any) => (event: any) => {

        if (prop == "verified_password") {
            setIsPasswordValid(checkPassword(formData.password, event.target.value))
            setVerifiedPassword(event.target.value);
        }
        else {
            if (prop == "username") {
                setIsUsernameValid(checkUsername(event.target.value))
            }
            if (prop == 'password') {
                setIsPasswordValid(checkPassword(event.target.value, verifiedPassword))
            }
            setFormData({ ...formData, [prop]: event.target.value });
        }

    };

    const [values, setValues] = useState({
        showPassword: false
    })
    const handleClickShowPasssword = (e: any) => {
        setValues({
            ...values, showPassword: !values.showPassword
        })
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5" component="div" align='center'>
                        Loging Info
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Item>
                        <Button sx={{ m: 1, width: '90%', margin: "auto" }}
                            variant={'outlined'}
                            onClick={() => {
                                setPage((page) => { return page <= 0 ? numPage - 1 : page - 1 });
                            }}>
                            Previous
                        </Button>
                    </Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>
                        <Button sx={{ m: 1, width: '90%', margin: "auto" }}
                            variant={'outlined'}
                            disabled={!(isPasswordValid.valid && isusernameValid.valid)}
                            onClick={() => {
                                setPage(page + 1 == numPage ? 0 : page + 1);
                            }}>
                            Next
                        </Button>
                    </Item>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Item>
                        <FormControl sx={{ m: 1, width: '90%', margin: "auto" }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                            <OutlinedInput
                                id="username"
                                type={true ? 'text' : 'password'}
                                value={formData.username}
                                onChange={handleChange('username')}
                                error={!isusernameValid.valid}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPasssword}
                                            onMouseDown={handleClickShowPasssword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Username"
                            />
                            <FormHelperText id="outlined-weight-helper-text">{isusernameValid.validation.join(" , ")}</FormHelperText>
                        </FormControl>
                    </Item>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Item>
                        <FormControl sx={{ m: 1, width: '90%', margin: "auto" }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange('password')}
                                error={!isPasswordValid.valid}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPasssword}
                                            onMouseDown={handleClickShowPasssword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                    </Item>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Item>
                        <FormControl sx={{ m: 1, width: '90%', margin: "auto" }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Verified Password</InputLabel>
                            <OutlinedInput
                                id="verified-password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={verifiedPassword}
                                onChange={handleChange('verified_password')}
                                error={!isPasswordValid.valid}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPasssword}
                                            onMouseDown={handleClickShowPasssword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Verified Password"
                            />
                            <FormHelperText id="outlined-weight-helper-text">{isPasswordValid.validation.join(" , ")}</FormHelperText>
                        </FormControl>
                    </Item>
                </Grid>


            </Grid>
        </Box>

    )
}

export default Register


