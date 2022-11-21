import { Box, Button, createTheme, Grid, Paper, styled, TextField, ThemeProvider, Typography } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react'
import { useFetchMembersComboQuery } from '../../features/Users/userSlice'
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import { useCreateReservationMutation, useFetchAllReservationsQuery } from '../../features/Reservations/reservationsApiSlice'
import IDevice from '../../Interfaces/API/IDevice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Types/Urls';
import { IReservationCreateApi } from '../../Interfaces/API/IReservation';
import ControledCombo, { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { IMemberCombo } from '../../Interfaces/API/IMember';

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
  const [createReservation] = useCreateReservationMutation();
  const { refetch } = useFetchAllReservationsQuery();
  const { data: members, isError, isLoading, error } = useFetchMembersComboQuery();
  const { data: devices, isError: isDeviceError, isLoading: isDeviceLoading, error: deviceError } = useFetchAllDevicesQuery();

  const [devicesItems,setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<InputComboItem | undefined>();
  const [membersItems,setMembersItem] = useState<InputComboItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<InputComboItem | undefined>();
  const [deviceDescription, setDeviceDescriptio] = useState("");
  let initialReservation: IReservationCreateApi = {
    date_from: new Date(),
    date_to: new Date(),
    _id_member: "",
    _id_device: ""
  }
 
  const [reservation, setReservation] = useState<IReservationCreateApi>(initialReservation);
  const navigate = useNavigate();
  const handleOnCancel = () => {

    navigate(`/${ROUTES.RESERVATION}`)
  }
  const handleOnSave = async () => {
    console.log(`navigate("/${ROUTES.RESERVATION}"`)
    console.log("Save/reservation", reservation,selectedMember,selectedDevice)
    console.log("Save/reservation", reservation.date_from?.toUTCString())
    const addReservation = reservation;
    addReservation._id_device = selectedDevice?._id === undefined ? "" : selectedDevice?._id;
    addReservation._id_member = selectedMember?._id === undefined ? "" : selectedMember?._id;

    console.log("Save/reservation/afterupdate", addReservation)
    const payload = await createReservation(addReservation);
    console.log("createReservation", payload);
    refetch();
    navigate(`/${ROUTES.RESERVATION}`)
  }
  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate();
    setReservation(prev => ({ ...prev, date_from: newDate }))
  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setReservation(prev => ({ ...prev, date_to: newDate }))
  };
 
  const onMemberChanged = (item : InputComboItem) =>  {
    setReservation(prev => ({ ...prev, _id_member: item._id}))
  }

  const onDeviceChanged = (item : InputComboItem) =>  {
    setReservation(prev => ({ ...prev, _id_device: item._id}))
    setDeviceDescriptio(getDeviceDetailed(item._id));
  }
  const handleMemberOnChange = (event: any, newValue: any) => {
    console.log("Reservation", reservation);
    console.log("member/target", event.target);
    console.log("Member/newValue", newValue);

    setReservation(prev => ({ ...prev, member: { _id: newValue._id, member_id: newValue.member_id, family_name: newValue.family_name, first_name: newValue.first_name } }))
    setSelectedMember(newValue);

  }
  const handleDeviceOnChange = (event: any, newValue: any) => {
    console.log("Reservation", reservation);
    console.log(event.target);
    console.log(newValue);

    setReservation(prev => ({ ...prev, device: { _id: newValue._id, device_id: newValue.device_id } }))
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
   
/*     if (membersCombo?.data)
      content = RenderAddReservation({ props: membersCombo?.data }); */
      let items  =   members?.data.map((item) => membersToItemCombo(item));
    if (items !== undefined)
      setMembersItem(items);
  }, [members?.data])

  useEffect(() => {
    console.log("AddReservation/ Devices.data", devices?.data)
    
    let items  =   devices?.data.map((item) => devicesToItemCombo(item));
    console.log("AddReservation/ DeviceItem", items)
    if (items !== undefined)
      setDevicesItem(items);
  }, [devices?.data])


  const devicesToItemCombo = (input: IDevice): InputComboItem => {
    return {  lable: input.device_id, _id: input._id ,description: ""}
  }
  const RenderLoading = (): any => {
    return (
      <div>Loading</div>
    )
  }
  const membersToItemCombo = (input: IMemberCombo): InputComboItem => {
    return {  lable: `${input.family_name} ${input.member_id}`, _id: input._id, description: "" }
  }

  const RenderError = (): any => {
    return (
      <div>
        <div>Error</div>{members?.errors.map((e) => (<li>{e}</li>))}
      </div>
    )
  }
  function getDeviceDetailed(_id: string | undefined) : string {
    console.log("getDeviceDetailed", _id)
    if(_id === undefined)
      return "";
     const device = devices?.data?.find((i) => i._id == _id);
     if(device)
      return `engien_meter: ${device.engien_meter} next_meter: ${device.maintanance.next_meter}`
     return "";
  }
  function RenderAddReservation(): any {


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
            <ControledCombo onSelectedItem={onDeviceChanged} selectedItem={selectedDevice === undefined ? null : selectedDevice} items={devicesItems}title="Devices"/>
      
          </Item>
        </Grid>
        <Grid item xs={12} md={6} xl={6}>
          <Item>
          <ControledCombo onSelectedItem={onMemberChanged} selectedItem={selectedMember === undefined ? null : selectedMember} items={membersItems} /* handleComboChange={handleDeviceOnChange} */ title="Members"/>

          </Item>
        </Grid>
        <Grid item xs={12} md={12} xl={12} sx={{ marginLeft: "0px", width: "100%" }}>
            <Item>
              <TextField
                disabled
                sx={{ marginLeft: "0px", width: "100%" }}
                name="description"
                id="outlined-disabled"
                label="Status"
                
                value={selectedDevice?.description}
              />
            </Item>
          </Grid>
        <Grid item xs={12} md={6} xl={6} >
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
    return <RenderAddReservation  />

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