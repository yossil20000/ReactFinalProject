import { Accordion, Box, Button, Grid } from '@mui/material'
import { createContext, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { InputComboItem } from '../../../Components/Buttons/InputCombo';
import DevicesCombo from '../../../Components/Devices/DevicesCombo';
import { useFetchAllDevicesQuery } from '../../../features/Device/deviceApiSlice'
import useLocalStorage from '../../../hooks/useLocalStorage';
import IDevice from '../../../Interfaces/API/IDevice';
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
      <Box margin={2}>
        <Grid container columns={3} >
          <Grid item xs={1}>
            <DevicesCombo onChanged={onDeviceChange} />
          </Grid>
          <Grid item xs={1}>
            <Button>Action</Button>
          </Grid>
          <Grid item xs={1}>
            <DevicesCombo onChanged={onDeviceChange} />
          </Grid>
        </Grid>

        <DeviceTabItem />
      </Box>
    </DevicesContext.Provider>
  )
}

export default DeviceTab