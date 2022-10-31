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
 const onSelecteGit = (items: LabelType[]) =>{
    console.log("onSelecteGit",items);
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
          <Grid item xs={1} justifySelf={"center"}>
            
            {/* <Typography sx={{ width: "100%", height:"100%" ,flexShrink: 0 ,textAlign: "center",  display:'flex',alignItems:"center"}} >Status Next Service</Typography> */}
            {/* <GitHubLabel items={[]} onSelected={onSelecteGit}/> */}
            
          
          </Grid>
        </Grid>

        <DeviceTabItem />
      </Box>
    </DevicesContext.Provider>
  )
}
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
  }]
export default DeviceTab