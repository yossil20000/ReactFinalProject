import { Label } from '@mui/icons-material';
import { Accordion, Box, Button, Grid, Typography } from '@mui/material'
import { createContext, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import ActionCombo from '../../../Components/Buttons/ActionCombo';
import GitHubLabel, { LabelType } from '../../../Components/Buttons/ComboPicker';
import { InputComboItem } from '../../../Components/Buttons/InputCombo';
import DevicesCombo from '../../../Components/Devices/DevicesCombo';
import { useFetchAllDevicesQuery } from '../../../features/Device/deviceApiSlice'
import useLocalStorage from '../../../hooks/useLocalStorage';
import IDevice, { DEVICE_INS } from '../../../Interfaces/API/IDevice';
import DeviceTabItem from './DeviceTabItem';


export type DevicesContextType = {
  selectedItem: IDevice | null | undefined;
  setSelectedItem: React.Dispatch<React.SetStateAction<IDevice | null | undefined>>
  devices: IDevice[] | undefined;
}
export const DevicesContext = createContext<DevicesContextType | null | undefined>(null)

function DeviceTab() {
  const { data: devices, isError, isLoading, isSuccess, error } = useFetchAllDevicesQuery();
  const [selectedDevice, setSelectedDevice] = useLocalStorage<IDevice | null | undefined>("admin_selectedDevice", null);


  if (devices?.data) {
    console.log("DevicesTab/devices", devices);
  }
  const onDeviceChange = (item: InputComboItem) => {
    const foundItem = devices?.data.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelectedDevice(foundItem);
      console.log("onDeviceChange/foundItem", foundItem)

    }

  }

  return (
    <DevicesContext.Provider value={{ devices: devices?.data, selectedItem: selectedDevice, setSelectedItem: setSelectedDevice }}>
      <Box marginTop={1}>
        <Grid container columns={2} width={"100%"} columnSpacing={1}>
          <Grid item xs={1}>
            <DevicesCombo onChanged={onDeviceChange} />
          </Grid>
          <Grid item xs={1}>
            <ActionCombo onChanged={onDeviceChange}/>
          </Grid>

        </Grid>

        <DeviceTabItem />
      </Box>
    </DevicesContext.Provider>
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