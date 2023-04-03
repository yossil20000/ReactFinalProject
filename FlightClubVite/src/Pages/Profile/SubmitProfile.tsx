import { Box, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import { useUpdateMemberMutation } from '../../features/Users/userSlice'
import { useNavigate } from 'react-router-dom';
import { green } from '@mui/material/colors';
import IMemberInfo from '../../Interfaces/IMemberInfo';
import IMemberUpdate from '../../Interfaces/IMemberInfo';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import { ROUTES } from '../../Types/Urls';
import { INotification } from '../../Interfaces/API/INotification';
import { useCreateNotifyMutation, useUpdateNotifyMutation } from '../../features/Notification/notificationApiSlice';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function SubmitProfile({ numPage, page, setPage, formData, setFormData }: IPageNavigate<IMemberUpdate>) {
    const navigate = useNavigate();
    const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);

    const [updateMember, { isError, isLoading, isSuccess, error }] = useUpdateMemberMutation();
    const onSaveProfileHandler = async () => {
        CustomLogger.log("onSaveProfileHandler", formData);
        try {
            const payload = await updateMember(formData as IMemberInfo).unwrap();
            CustomLogger.info("onSaveProfileHandler/useUpdateMemberMutation/payload", payload)
        }
        catch (error) {
            CustomLogger.error("onSaveProfileHandler/error", error)
            let validation = getValidationFromError(error, onValidationAlertClose);
            setValidationAlert(validation);
        }

    }
    const onValidationAlertClose = () => {
        setValidationAlert([]);
    }
    useEffect(() => {
        if (isError) {
            CustomLogger.error("SubmitRegistration/error", error);
            let validation = getValidationFromError(error, onValidationAlertClose);
            setValidationAlert(validation);
            return;
        }
        if (isSuccess) {
            CustomLogger.log("SubmitProfile/Success");
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
                        Submit Profile
                    </Typography>
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
                <Grid item xs={6}>
                    <Item>
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button
                                variant="contained"
                                sx={buttonSx}
                                disabled={isLoading}
                                onClick={() => navigate(`/${ROUTES.HOME}`)}
                            >
                                Back to Home
                            </Button>

                        </Box>
                    </Item>
                </Grid>
                <Grid item xs={6}>
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

export default SubmitProfile


