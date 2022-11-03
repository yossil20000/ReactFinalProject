import { Box, Grid } from '@mui/material'
import { useContext } from 'react';
import { DevicesContext, DevicesContextType } from '../../../app/Context/DevicesContext';
import { DeviceTypesContext, DeviceTypesContextType } from '../../../app/Context/DeviceTypesContext';
import ActionCombo from '../../../Components/Buttons/ActionCombo';
import { InputComboItem } from '../../../Components/Buttons/InputCombo';
import DevicesCombo from '../../../Components/Devices/DevicesCombo';
import { useFetchAllDevicesQuery, useUpdateDeviceMutation } from '../../../features/Device/deviceApiSlice'
import { useFetchAllDeviceTypesQuery } from '../../../features/DeviceTypes/deviceTypesApiSlice';
import useLocalStorage from '../../../hooks/useLocalStorage';
import IDevice, { DEVICE_MET, DEVICE_MT, DEVICE_STATUS } from '../../../Interfaces/API/IDevice';
import IDeviceType from '../../../Interfaces/API/IDeviceType';
import { FuelUnits } from '../../../Types/FuelUnits';
import DeviceTabItem from './DeviceTabItem';

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
            instruments: []
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
    <Box marginTop={1}>
      <Grid container columns={2} width={"100%"} columnSpacing={1}>
        <Grid item xs={1}>
          <DevicesCombo onChanged={onDeviceChange} source={source} />
        </Grid>
        <Grid item xs={1}>
          <ActionCombo onChanged={onActionChange} source={source}/>
        </Grid>
      </Grid>
      <DeviceTabItem />
    </Box>
  )
}

const selectedLables = [
  {
    name: 'good first issue',
    color: '#7057ff',
    description: 'Good for newcomers',
  },
  {
    name: 'help wanted',
    color: '#008672',
    description: 'Extra attention is needed',
  }]


// From https://github.com/abdonrd/github-labels
const labels = [
  {
    name: 'good first issue',
    color: '#7057ff',
    description: 'Good for newcomers',
  },
  {
    name: 'help wanted',
    color: '#008672',
    description: 'Extra attention is needed',
  },
  {
    name: 'priority: critical',
    color: '#b60205',
    description: '',
  },
  {
    name: 'priority: high',
    color: '#d93f0b',
    description: '',
  },
  {
    name: 'priority: low',
    color: '#0e8a16',
    description: '',
  },
  {
    name: 'priority: medium',
    color: '#fbca04',
    description: '',
  },
  {
    name: "status: can't reproduce",
    color: '#fec1c1',
    description: '',
  },
  {
    name: 'status: confirmed',
    color: '#215cea',
    description: '',
  },
  {
    name: 'status: duplicate',
    color: '#cfd3d7',
    description: 'This issue or pull request already exists',
  },
  {
    name: 'status: needs information',
    color: '#fef2c0',
    description: '',
  },
  {
    name: 'status: wont do/fix',
    color: '#eeeeee',
    description: 'This will not be worked on',
  },
  {
    name: 'type: bug',
    color: '#d73a4a',
    description: "Something isn't working",
  },
  {
    name: 'type: discussion',
    color: '#d4c5f9',
    description: '',
  },
  {
    name: 'type: documentation',
    color: '#006b75',
    description: '',
  },
  {
    name: 'type: enhancement',
    color: '#84b6eb',
    description: '',
  },
  {
    name: 'type: epic',
    color: '#3e4b9e',
    description: 'A theme of work that contain sub-tasks',
  },
  {
    name: 'type: feature request',
    color: '#fbca04',
    description: 'New feature or request',
  },
  {
    name: 'type: question',
    color: '#d876e3',
    description: 'Further information is requested',
  },
];

export default DeviceTab