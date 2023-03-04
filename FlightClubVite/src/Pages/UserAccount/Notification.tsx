import { Box, Checkbox, FormControlLabel, Grid, Paper, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { getNewNotification, INotification, INotify, newNotification, NotifyBy, NotifyEvent, NotifyOn } from '../../Interfaces/API/INotification';
import { SetProperty } from '../../Utils/setProperty';
import CheckSelect from '../../Components/Buttons/CheckSelect';
import { useCallback, useEffect, useState } from 'react';
import { LabelType } from '../../Components/Buttons/MultiOptionCombo';
import { useCreateNotifyMutation, useFetchAllNotifiesQuery, useUpdateNotifyMutation } from '../../features/Notification/notificationApiSlice';
import { useAppSelector } from '../../app/hooks';
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container';
import Notify from './Notify';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function NotificationPage() {
  const [isSaved,setIsSaved] = useState(false);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  

  const login = useAppSelector((state) => state.authSlice);
  const [notification, setNotification] = useState<INotification>(getNewNotification(login.member._id));
  const { data: dataNotification, isLoading: isNotifiesLoading ,refetch} = useFetchAllNotifiesQuery(login.member._id)
 const [createNotification,{isError: isCreateError}] = useCreateNotifyMutation();
 const [updateNotification,{isError: isUpdateError}] = useUpdateNotifyMutation();
 
  useEffect(() => {
    if (dataNotification && dataNotification.success) {
      if (dataNotification.data[0]) {
        const obj: INotification = {
          _id: dataNotification.data[0]._id,
          member: {
            _id: dataNotification.data[0].member._id,
            fullName: dataNotification.data[0].member.fullName,
            email: dataNotification.data[0].member.email,
            phone: dataNotification.data[0].member.phone
          },
          enabled: dataNotification.data[0].enabled ? true : false,
          notify: []
        }
        dataNotification.data[0].notify.forEach(element => {
          obj.notify.push({ ...element })
        });
        setNotification(obj)
      }
    }
  }, [isNotifiesLoading])
  const handleNotifyChange = (prop: string) => (event: any) => {
    let newObj = SetProperty(notification, prop, event.target.value)
    setNotification(newObj);
    console.log("notifyForm", newObj, prop)
  };

  const handleBoolainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Notification/handleBoolainChange", event.target.name, event.target.checked)
    const newObj = SetProperty(notification, event.target.name, event.target.checked);

    setNotification(newObj)
    console.log("Notification/handleBoolainChange/newObj", event.target.name, newObj)
  };

  const onNotifyChanged = (newNotify: INotify): void => {
    if (notification === undefined) return;
    let notifyIndex = notification.notify.findIndex((item) => item.event === newNotify.event)
    console.log("Notification/onNotifyChanged/foundindex/", notifyIndex, newNotify)
    if (notifyIndex >= 0) {
      /* newnotification.notify[1] = newNotify */
      const obj: INotification = { ...notification }
      obj.notify[notifyIndex] = newNotify
      setNotification(obj)
      console.log("Notification/onNotifyChanged/SetNotification/", notifyIndex, obj)

    }

  }
  const handleOnValidatiobClose = () => {
    setValidationAlert([])
  }
  const onSave = async () => {
    setValidationAlert([]);
    setIsSaved(false)
        if(notification._id === ""){
          createNotification(notification).unwrap().then((data) => {
            console.log("Notification/onSavecreateNotification/", data);
            if (data.success) {
              setIsSaved(true)
            }
    
          }).catch((err) => {
            const validation = getValidationFromError(err, handleOnValidatiobClose);
            setValidationAlert(validation);
            console.log("Notification/onSave/error/createNotification", err.data.errors);
          });
        }
        else{
          updateNotification(notification).unwrap().then((data) => {
            console.log("Notification/onSave/updateNotification/", data);
            if (data.success) {
              setIsSaved(true)
            }
    
          }).catch((err) => {
            const validation = getValidationFromError(err, handleOnValidatiobClose);
            setValidationAlert(validation);
            console.log("Notification/onSave/error/updateNotification", err.data.errors);
          });
        }
        refetch();
    }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    console.log("ActionButtons/onAction", event?.target, action)
    switch (action) {
      
      case EAction.SAVE:
        onSave()
        break;
    }
  }





  return (
    <ContainerPage>
      <>
        <ContainerPageHeader><></></ContainerPageHeader>
        <ContainerPageMain>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <Typography variant="h5" component="div" align='center'>
                  Notification
                </Typography>
              </Grid>
              <Grid item xs={4} >
                <FormControlLabel control={<Checkbox onChange={(event) => handleBoolainChange(event)} name={"enabled"} checked={notification?.enabled === undefined ? false : notification?.enabled} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Enabled" />
              </Grid>
              <Grid item xs={12} md={12}>
                <Item>
                  <TextField sx={{ width: "100%", margin: "auto" }}
                    required
                    id="fullName"
                    label="Full Name"
                    value={notification.member.fullName}
                    onChange={handleNotifyChange("member.fullName")}
                  />
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  <TextField sx={{ width: "100%", margin: "auto" }}
                    required
                    id="email"
                    label="email"
                    value={notification.member.email}
                    onChange={handleNotifyChange("member.email")}
                  />
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  <TextField sx={{ width: "100%", margin: "auto" }}
                    required
                    id="phone"
                    label="Phone"
                    value={notification.member.phone}
                    onChange={handleNotifyChange("member.phone")}
                  />
                </Item>
              </Grid>
              {

                notification?.notify.map((i, index) => (
                  <Grid item xs={6} key={`${i.event}${index}`}>
                    <Item>
                      <Notify notify={i} onChanged={onNotifyChanged} />

                    </Item>
                  </Grid>
                ))
              }

            </Grid>
          </Box>
        </ContainerPageMain>
        <ContainerPageFooter>
          <>

            <Grid container>
              {validationAlert.map((item) => (
                <Grid item xs={12}>

                  <ValidationAlert {...item} />

                </Grid>
              ))}
              <Grid item xs={12}>
              <Box className='yl__action_button' >
            <ActionButtons OnAction={onAction} show={[ EAction.SAVE]} item={""}/>

          </Box>
              </Grid>
            </Grid></>
        </ContainerPageFooter>
      </>
    </ContainerPage>


  )
}



export default NotificationPage