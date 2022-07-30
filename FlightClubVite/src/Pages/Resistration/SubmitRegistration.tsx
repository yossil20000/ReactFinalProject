import { Box, Container, CssBaseline, FormControl, Grid, IconButton, Input, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material';
import  { useState } from 'react'
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function SubmitRegistration({ numPage, page, setPage, formData, setFormData }: IPageNavigate) {

    const handleChange = (prop: any) => (event: any) => {
        setFormData({ ...formData, [prop]: event.target.value });

    };
    const handleemailChange = (prop: any) => (event: any) => {
        setFormData({ ...formData, contact:{...formData.contact, [prop]: event.target.value}  });
        console.log("formData", formData)
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
                    <Item><button>
                        Save
                    </button></Item>
                </Grid>
                <Grid item xs={6}>
                    <Item><button
                        onClick={() => {
                            setPage((page) => { return page <= 0 ? numPage - 1 : page - 1 });
                        }}>
                        Previous
                    </button></Item>
                </Grid>
                <Grid item xs={6}>
                    <Item><button
                        onClick={() => {
                            setPage(page + 1 == numPage ? 0 : page + 1);
                        }}>
                        Next
                    </button></Item>
                </Grid>

            </Grid>
        </Box>

    )
}

export default SubmitRegistration


