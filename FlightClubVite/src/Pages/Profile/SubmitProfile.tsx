import { Box, Container, CssBaseline, FormControl, Grid, IconButton, Input, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material';
import { useEffect, useState } from 'react'
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { TonalitySharp, Visibility, VisibilityOff } from '@mui/icons-material';
import { useUpdateMemberMutation } from '../../features/Users/userSlice'
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../Enums/Routers';
import { ROUTES } from '../../Types/Urls';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function SubmitProfile({ numPage, page, setPage, formData, setFormData }: IPageNavigate) {
const navigate = useNavigate();
    const [updateMember, { isError, isLoading, isSuccess, error }] = useUpdateMemberMutation();
    const onSaveProfileHandler = async () => {
        console.log("onSaveProfileHandler", formData);
           await updateMember(formData); 

    }
    useEffect(() => {
        if (isError) {
            console.log("SubmitProfile/error", error);
        }
        if (isSuccess) {
            console.log("SubmitProfile/Success");
            navigate(`/${ROUTES.MEMBERS}`)

        }

    }, [isLoading])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Item><button onClick={onSaveProfileHandler}>
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

export default SubmitProfile


