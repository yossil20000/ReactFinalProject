import { Margin } from '@mui/icons-material';
import { Autocomplete, Box, Button, createTheme, Grid, Paper, Stack, styled, TextField, ThemeProvider, Typography } from '@mui/material'
import { DateTimePicker, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import React, { useEffect } from 'react'
import { IFlightReservationProps } from '../../Interfaces/IFlightReservationProps';
import {useFetchMembersComboQuery} from '../../features/Users/userSlice'
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
  let content : any;
  const {data : membersCombo,isError,isLoading,error} = useFetchMembersComboQuery();

  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate();

  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate();

  };
  const device = ["4xcgc", "4xfgh"]
  useEffect(() => {
    console.log("AddReservation", isLoading)
    if(isLoading) {
      content = <RenderLoading/>;
      return;
    }
    if(!isLoading) {
      content = <RenderLoading/>;
      return;
    }
    if(isError){
      content = RenderError()
      return;
    }
    content = RenderAddReservation();
  },[membersCombo?.data,isLoading])
const RenderLoading = () : any => {
  return (
    <div>{content}</div>
  )
}
const RenderError = () : any => {
  return (
    <div>
      <div>Error</div>{membersCombo?.errors.map((e) => (<li>{e}</li>))}
    </div>
  )
}
  const  RenderAddReservation = () : any => {
    return (
      <Grid container sx={{ width: "100%" }} justifyContent="center">
        <Grid item xs={12} >
          <Typography variant='h5' component="div" align='center'>New Reservation</Typography>
        </Grid>
        <Grid item sx={{marginLeft: "0px"}} xs={12} md={6} xl={6} >
          <Item sx={{marginLeft: "0px"}}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <ThemeProvider theme={defaultMaterialThem}>
                <DateTimePicker 
                  label="From Date"
                  value={new Date()}
                  onChange={handleFromDateFilterChange}
                  renderInput={(params) => <TextField {...params}  size={'small'} helperText={null} sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, marginLeft:"0"}} />}
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
        <Grid item xs={12} md={6} xl={6} sx={{marginLeft: "0px"}}>
          <Item>
            <Autocomplete  
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={device.map((option) => option)}

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
              options={device.map((option) => option)}

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
   function Render(){
    
    if(isLoading)
    return <RenderLoading/>
    return <RenderAddReservation/>

  }
  return (
    <div className='main' style={{ overflow: 'auto' }}>
          <Box sx={{ flexGrow: 1 }}>
        <Render/>
    </Box>
    </div>

  )
}

export default AddReservationPage