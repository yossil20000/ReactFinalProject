import { Margin } from '@mui/icons-material';
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

  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate();

  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate();

  };

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
  const RenderAddReservation = (props: { props: IMemberCombo[] }): any => {
    const memberCombo = props.props;
    const handleOnChange = (event: any, newValue: any) => {
      console.log(event.target);
      console.log(newValue);
    }
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
                  value={new Date()}
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

                  label="From Date"
                  value={new Date()}
                  onChange={handleFromDateFilterChange}
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
              onChange={handleOnChange}
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
              onChange={handleOnChange}
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
            onClick={() => {
              ;
            }}>

            Cancle
          </Button></Item>
        </Grid>
        <Grid item xs={12} md={6} xl={6}>
          <Item><Button variant="outlined" sx={{ width: "100%" }}
            onClick={() => {

            }}>
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