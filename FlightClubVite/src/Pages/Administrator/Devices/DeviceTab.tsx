import { Box, Button, Grid } from '@mui/material'
import { useContext } from 'react';
import { DevicesContext, DevicesContextType } from '../../../app/Context/DevicesContext';
import { DeviceTypesContext, DeviceTypesContextType } from '../../../app/Context/DeviceTypesContext';
import ActionCombo from '../../../Components/Buttons/ActionCombo';
import { InputComboItem } from '../../../Components/Buttons/InputCombo';
import DevicesCombo from '../../../Components/Devices/DevicesCombo';
import { useUpdateDeviceMutation } from '../../../features/Device/deviceApiSlice'
import IDevice, { DEVICE_INS, DEVICE_MET, DEVICE_MT, DEVICE_STATUS } from '../../../Interfaces/API/IDevice';
import { FuelUnits } from '../../../Types/FuelUnits';
import DeviceTabItem from './DeviceTabItem';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
const source: string = "DeviceTab"


function DeviceTab() {

  const { selectedItem: selectedDevice, setSelectedItem: setSelectedDevice, devices } = useContext(DevicesContext) as DevicesContextType;
  const { selectedItem: selectedDeviceTypes, setSelectedItem: setSelectedDeviceTypes, deviceTypes } = useContext(DeviceTypesContext) as DeviceTypesContextType

  const [updateDevice] = useUpdateDeviceMutation();

  if (devices) {
    console.log("DevicesTab/devices", devices);
  }
  const onDeviceChange = (item: InputComboItem) => {
    const foundItem = devices?.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelectedDevice(foundItem);
      console.log("onDeviceChange/foundItem", foundItem)

    }

  }

  const onActionChange = async (item: InputComboItem) => {
    console.log("onActionChange/foundItem", item.lable)
    switch (item.lable) {
      case "ADD":
        const newDEvice: IDevice = {
          _id: '',
          device_id: 'newDevice',
          device_type: "",
          description: '',
          available: false,
          device_status: DEVICE_STATUS.NOT_EXIST,
          due_date: new Date(),
          hobbs_meter: 0,
          engien_meter: 0,
          maintanance: {
            type: DEVICE_MT.hr50,
            next_meter: 0
          },
          price: {
            base: 0,
            meter: DEVICE_MET.HOBBS
          },
          details: {
            image: '',
            color: '',
            seats: 0,
            fuel: {
              quantity: 0,
              units: FuelUnits.galon
            },
            instruments: [DEVICE_INS.VFR]
          },
          location_zone: '',
          can_reservs: [],
          flights: [],
          flight_reservs: []
        }
        setSelectedDevice(newDEvice);
        break;
      case "UPDATE":
        if (selectedDevice)
          await updateDevice(selectedDevice);
        break;
    }
    const foundItem = devices?.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {

      console.log("onActionChange/foundItem", foundItem)

    }

  }

  return (
    <>
      <div className='yl__container' style={{ height:"100%" ,position:"relative"}}>
        <div className='header'>
          <Box marginTop={1}>
            <Grid container columns={2} width={"100%"} columnSpacing={1} style={{paddingLeft: 0}} >
              <Grid item xs={1} style={{paddingLeft: 0}}>
                <DevicesCombo onChanged={onDeviceChange} source={source} />
              </Grid>
              <Grid item xs={1} style={{paddingLeft: 0}}>
                <ActionCombo onChanged={onActionChange} source={source} />
              </Grid>
            </Grid>

          </Box>

        </div>
        <div className='main' style={{ overflow: "auto" ,height:"100%"}}>
          <Box marginTop={1} height={"100%"}>
            <DeviceTabItem />

          </Box>

        </div>
        <div className='footer' >
          <Box style={{ width: '100%', height: '5ch', display: 'flex', alignContent: 'center', justifyContent: 'space-around' }}>
            <Button variant='outlined' color='success' startIcon={<AddCircleOutlineIcon />}>Add</Button>
            <Button variant='outlined' color='secondary' startIcon={<DeleteIcon />}>Delete</Button>
            <Button variant='contained'>Save</Button>
          </Box>
        </div>
      </div>

    </>
  )
}



export default DeviceTab