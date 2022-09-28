import { Box, Button, createTheme, Grid, Paper, styled, TextField, ThemeProvider, Typography } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { useState } from 'react'
import { useUpdateReservationMutation, useFetchAllReservationsQuery } from '../../features/Reservations/reservationsApiSlice'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Types/Urls';
import { IReservationUpdate } from '../../Interfaces/API/IReservation';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const defaultMaterialThem = createTheme({

})
function UpdateReservationPage(props: IReservationUpdate) {
  
  const [updateReservation] = useUpdateReservationMutation();
  const { refetch } = useFetchAllReservationsQuery();
    
  const [reservation, setReservation] = useState<IReservationUpdate>(props);
  const navigate = useNavigate();
  const handleOnCancel = () => {

    navigate(`/${ROUTES.RESERVATION}`)
  }
  const handleOnSave = async () => {
    console.log(`navigate("/${ROUTES.RESERVATION}"`)
    console.log("Save/reservation", reservation)
    console.log("Save/reservation", reservation.date_from?.toUTCString())

    const payload = await updateReservation(reservation);
    console.log("createReservation", payload);
    refetch();
    navigate(`/${ROUTES.RESERVATION}`)
  }
  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setReservation(prev => ({ ...prev, date_from: newDate }))
  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setReservation(prev => ({ ...prev, date_to: newDate }))
  };
  
  const RenderLoading = (): any => {
    return (
      <div>Loading</div>
    )
  }
  const RenderError = (): any => {
    return (
      <div>
        <div>Error</div>
      </div>
    )
  }
  function RenderUpdateReservation(): any {
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
                disableMaskedInput
                  label="From Date"
                  mask=''
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
                  mask=''
                  disableMaskedInput
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
          <TextField
          disabled
          id="outlined-disabled"
          label="Disabled"
          defaultValue="Hello World"
        />
          </Item>
        </Grid>
        <Grid item xs={12} md={6} xl={6}>
          <Item>
          <TextField
          disabled
          id="outlined-disabled"
          label="Disabled"
          defaultValue="Hello World"
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

    if (false)
      return <RenderLoading />
    return <RenderUpdateReservation  />

  }
  return (
    <div className='main' style={{ overflow: 'auto' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Render />
      </Box>
    </div>

  )
}

export default UpdateReservationPage