import { Box, Button, Container, CssBaseline, FormControl, Grid, IconButton, Input, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material';
import { useEffect, useState } from 'react'
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IMember from '../../Interfaces/API/IMember';
import IMemberCreate from '../../Interfaces/IMemberCreate';
import { useCreateMemberMutation } from '../../features/Users/userSlice';
import { green } from '@mui/material/colors';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function SubmitRegistration({ numPage, page, setPage, formData, setFormData }: IPageNavigate<IMemberCreate>) {

    const [createMember, { isError, isLoading, isSuccess, error }] = useCreateMemberMutation();
    const onSaveRegisterHandler = async () => {
        console.log("onSaveRegisterHandler/formData", formData);
        const payload = await createMember(formData);
        console.log("useCreateMemberMutation/paylod", payload);
    }
    useEffect(() => {
        if (isError) console.log("SubmitRegistration/error", error);
        if (isSuccess) {
            console.log("SubmitRegistration/succeed");
        }
    }, [isLoading])
    const buttonSx = {
        ...(isSuccess && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Item>
                        <Button
                            variant="contained"
                            sx={buttonSx}
                            disabled={isLoading}
                            onClick={onSaveRegisterHandler}
                        >
                            Save
                        </Button>
                    </Item>
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


