import { Margin, NestCamWiredStandTwoTone } from '@mui/icons-material';
import { Autocomplete, Box, Button, createTheme, Grid, Paper, Stack, styled, TextField, ThemeProvider, Typography } from '@mui/material'
import { DateTimePicker, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react'
import { IDeviceCombo, IFlightReservationProps } from '../../Interfaces/IFlightReservationProps';
import { useFetchMembersComboQuery } from '../../features/Users/userSlice'
import { IMemberCombo } from '../../Interfaces/IFlightReservationProps'
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import IDevice from '../../Interfaces/API/IDevice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Types/Urls';
import IReservation, { IReservationCreate } from '../../Interfaces/API/IReservation';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const defaultMaterialThem = createTheme({

})
function AddReservationPage() {
  let content: any;
  const { data: membersCombo, isError, isLoading, error } = useFetchMembersComboQuery();
  const { data: devices, isError: isDeviceError, isLoading: isDeviceLoading, error: deviceError } = useFetchAllDevicesQuery();
  const [devicesCombo, setDevices] = useState<IDeviceCombo[]>([]);
const [selectedDevice,setSelectedDevice] = useState<IDeviceCombo>();
const [selectedMember,setSelectedMember] = useState<IMemberCombo>();
  let initialReservation : IReservationCreate = {
    date_from: new Date(),
    date_to: new Date(),
    member: undefined,
    device: undefined
  }
  const [reservation,setReservation] = useState<IReservationCreate>(initialReservation);
  const navigate = useNavigate();
  const handleOnCancel =() => {
    
    navigate(`/${ROUTES.RESERVATION}`)
  }
  const handleOnSave =() => {
    console.log("navigate(`/${ROUTES.RESERVATION}`)")
    console.log("Save/reservation", reservation)
    console.log("Save/reservation", reservation.date_from?.toUTCString())
    /* navigate(`/${ROUTES.RESERVATION}`) */
  }
  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate();
    setReservation(prev => ({...prev,date_from: newDate}))
  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setReservation(prev => ({...prev,date_to: newDate}))
  };
  const handleMemberOnChange = (event: any, newValue: any) => {
    console.log("Reservation",reservation);
    console.log("member/target",event.target);
    console.log("Member/newValue",newValue);
    
    setReservation(prev => ({...prev,member: {_id:newValue._id, member_id: newValue.member_id,family_name: newValue.family_name, first_name: newValue.first_name}}))
    setSelectedMember(newValue);
    
  }
  const handleDeviceOnChange = (event: any, newValue: any) => {
    console.log("Reservation",reservation);
    console.log(event.target);
    console.log(newValue);
    
    setReservation(prev => ({...prev,device: {_id:newValue._id, device_id: newValue.device_id}}))
    setSelectedDevice(newValue);
  }

  useEffect(() => {

    if (isLoading) {
      content = <RenderLoading />;
      return;
    }

    if (isError) {
      content = RenderError()
      return;
    }
    console.log("AddReservation/ membersCombo", membersCombo?.data?.map((i) => console.log(i._id)))
    if (membersCombo?.data)
      content = RenderAddReservation({ props: membersCombo?.data });
  }, [membersCombo?.data])
  useEffect(() => {
    let d = devices?.data.map((item) => devicesToDeviceCombo(item));
    if (d !== undefined)
      setDevices(d);
  }, [devices?.data])

  const devicesToDeviceCombo = (input: IDevice): IDeviceCombo => {
    return { device_id: input.device_id, _id: input._id }
  }
  const RenderLoading = (): any => {
    return (
      <div>Loading</div>
    )
  }
  const RenderError = (): any => {
    return (
      <div>
        <div>Error</div>{membersCombo?.errors.map((e) => (<li>{e}</li>))}
      </div>
    )
  }
  function RenderAddReservation (props: { props: IMemberCombo[] }): any  {
    const memberCombo = props.props;
    

    return (
      <Grid container sx={{ width: "100%" }} justifyContent="center">
        <Grid item xs={12} >
          <Typography variant='h5' component="div" align='center'>New Reservation</Typography>
        </Grid>
        <Grid item sx={{ marginLeft: "0px" }} xs={12} md={6} xl={6} >
          <Item sx={{ marginLeft: "0px" }}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <ThemeProvider theme={defaultMaterialThem}>
                <DateTimePicker
                  label="From Date"
                  value={reservation.date_from}
                  onChange={handleFromDateFilterChange}
                  renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, marginLeft: "0" }} />}
                />

              </ThemeProvider>

            </LocalizationProvider>
          </Item>

        </Grid>
        <Grid item xs={12} md={6} xl={6}>
          <Item >
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <ThemeProvider theme={defaultMaterialThem}>
                <DateTimePicker

                  label="To Date"
                  value={reservation.date_to}
                  onChange={handleToDateFilterChange}
                  renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, }} />}
                />

              </ThemeProvider>

            </LocalizationProvider>
          </Item>

        </Grid>
        <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
          <Item>
            <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={devicesCombo}
              getOptionLabel={option => (option as IDeviceCombo).device_id}
              value={selectedDevice}
              onChange={handleDeviceOnChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, }}

                  size={'small'}
                  label="Device"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search'
                  }}
                />
              )}
            />
          </Item>
        </Grid>
        <Grid item xs={12} md={6} xl={6}>
          <Item>
            <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={memberCombo}
              getOptionLabel={option => `${(option as IMemberCombo).member_id} ${(option as IMemberCombo).family_name}`}
              value={selectedMember}
              onChange={handleMemberOnChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, }}
                  size={'small'}
                  label="Member"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
            />

          </Item>
        </Grid>
        <Grid item xs={12} md={6} xl={6}>
          <Item><Button variant="outlined" sx={{ width: "100%" }}
            onClick={handleOnCancel}>

            Cancle
          </Button></Item>
        </Grid>
        <Grid item xs={12} md={6} xl={6}>
          <Item><Button variant="outlined" sx={{ width: "100%" }}
            onClick={handleOnSave}>
            Save
          </Button></Item>
        </Grid>
      </Grid>
    )
  }
  function Render() {

    if (isLoading && isDeviceLoading)
      return <RenderLoading />
    return <RenderAddReservation props={membersCombo?.data === undefined ? [] : membersCombo?.data} />

  }
  return (
    <div className='main' style={{ overflow: 'auto' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Render />
      </Box>
    </div>

  )
}

export default AddReservationPage