import { Box, Button, CircularProgress, Container, CssBaseline, FormControl, Grid, IconButton, Input, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material';
import { useEffect, useState } from 'react'
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { TonalitySharp, Visibility, VisibilityOff } from '@mui/icons-material';
import { useUpdateMemberMutation } from '../../features/Users/userSlice'
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../Enums/Routers';
import { ROUTES } from '../../Types/Urls';
import { green } from '@mui/material/colors';
import IMemberInfo from '../../Interfaces/IMemberInfo';
import IMemberCreate from '../../Interfaces/IMemberCreate';
import IMemberUpdate from '../../Interfaces/IMemberInfo';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function SubmitProfile({ numPage, page, setPage, formData, setFormData }: IPageNavigate<IMemberUpdate>) {
    const navigate = useNavigate();
    const [updateMember, { isError, isLoading, isSuccess, error }] = useUpdateMemberMutation();
    const onSaveProfileHandler = async () => {
        console.log("onSaveProfileHandler", formData);
        const payload = await updateMember(formData as IMemberInfo).unwrap();
        console.log("useUpdateMemberMutation/payload", payload)
    }
    useEffect(() => {
        if (isError) {
            console.log("SubmitProfile/error", error);
        }
        if (isSuccess) {
            console.log("SubmitProfile/Success");
            /* navigate(`/${ROUTES.MEMBERS}`) */

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
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button
                                variant="contained"
                                sx={buttonSx}
                                disabled={isLoading}
                                onClick={onSaveProfileHandler}
                            >
                                Save
                            </Button>
                            {isLoading && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: green[500],
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                        </Box>
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
                    <Item>
                        <button

                            onClick={() => {
                                setPage(page + 1 == numPage ? 0 : page + 1);
                            }}>
                            Next
                        </button>
                    </Item>
                </Grid>

            </Grid>
        </Box>

    )
}

export default SubmitProfile


