import { Box, Button, Container, CssBaseline, FormControl, Grid, IconButton, Input, InputLabel, OutlinedInput, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IMember from '../../Interfaces/API/IMember';
import IMemberCreate from '../../Interfaces/IMemberCreate';
import { useCreateMemberMutation } from '../../features/Users/userSlice';
import { green } from '@mui/material/colors';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import { IValidation } from '../../Interfaces/IValidation';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Types/Urls';
import { INotification } from '../../Interfaces/API/INotification';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function SubmitRegistration({ numPage, page, setPage, formData, setFormData}: IPageNavigate<IMemberCreate>) {
    const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
    const [createMember, { isError, isLoading, isSuccess, error }] = useCreateMemberMutation();
    const navigate = useNavigate();
    const onSaveRegisterHandler = async () => {

        console.log("onSaveRegisterHandler/formData", formData);
        const payload = await createMember(formData);
        console.log("useCreateMemberMutation/paylod", payload);
    }
    const onValidationAlertClose = () => {
        setValidationAlert([]);
    }
    useEffect(() => {
        
        if (isError) {
            console.log("SubmitRegistration/error", error);
            let validation = getValidationFromError(error, onValidationAlertClose);
            setValidationAlert(validation);
            return;
            
        }

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
                    <Typography variant="h5" component="div" align='center'>
                        Submit Registration
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
                            onClick={() => {
                                setPage(page + 1 == numPage ? 0 : page + 1);
                            }}>
                            Next
                        </Button>
                    </Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>
                        <Button
                            variant="contained"
                            sx={buttonSx}
                            disabled={isLoading}
                            onClick={() => navigate(`/${ROUTES.HOME}`)}
                        >
                            Back to Home
                        </Button>
                    </Item>
                </Grid>
                <Grid item xs={6}>
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
                {validationAlert.map((item) => (
                    <Grid item xs={12}>
                        <Item>

                            <ValidationAlert {...item} />
                        </Item>
                    </Grid>
                ))}


            </Grid>
        </Box>

    )
}

export default SubmitRegistration


