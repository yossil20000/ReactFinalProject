import React, { createContext, useMemo, useState } from 'react'
import { ColorModeContext, useMode } from "../../theme"
import { createTheme, CssBaseline, PaletteMode, Paper, Theme, ThemeProvider } from '@mui/material'
import { amber, grey, deepOrange, red, blue } from '@mui/material/colors';
import ScrollableTabs, { ScrollableTabsItem } from '../../Components/Buttons/ScrollableTabs';
import DeviceTab from './Devices/DeviceTab';
import DevicesCombo from '../../Components/Devices/DevicesCombo';
import DeviceTypeTab from './DeviceType/DeviceTypeTab';
import { DevicesContext } from '../../app/Context/DevicesContext';
import { DeviceTypesContext } from '../../app/Context/DeviceTypesContext';
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import { useFetchAllDeviceTypesQuery } from '../../features/DeviceTypes/deviceTypesApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDevice from '../../Interfaces/API/IDevice';
import IDeviceType from '../../Interfaces/API/IDeviceType';

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
        // palette values for light mode
        primary: amber,
        divider: amber[200],
        background: {
          default: grey[500],
          paper: red[200],
        },
        text: {
          primary: grey[100],
          secondary: grey[200],
        },
      }
      : {
        // palette values for dark mode
        primary: blue,
        divider: deepOrange[700],
        background: {
          default: grey[500],
          paper: blue[400],
        },
        text: {
          primary: '#fff',
          secondary: grey[100],
        },
      }),
  },
});

const items: ScrollableTabsItem[] = [
  { id: 0, label: "Devices" },
  { id: 1, label: "Device Type" },
  { id: 2, label: "Members" }

]

function AdminPage() {
  const [theme1, colorMode1] = useMode()
  const [value, setValue] = React.useState(0);
  const [mode, setMode] = useState<PaletteMode>('light');
  const { data: devices, isError, isLoading, isSuccess, error } = useFetchAllDevicesQuery();
  const { data: deviceTypes } = useFetchAllDeviceTypesQuery();
  const [selectedDevice, setSelectedDevice] = useLocalStorage<IDevice | null | undefined>("_admin/selectedDevice", null);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useLocalStorage<IDeviceType | null | undefined>("_admin/selectedDeviceType", null);
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    console.log("AdminPage/newValue", newValue)
  }

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const RederTab = () => {
    switch (value) {
      case 0:
        return (<DeviceTab />)
      case 1:
        return (<DeviceTypeTab />)
      default:
        return (<div>I am tab </div>)
    }
  }
  return (
    <>
      {/* <ColorModeContext.Provider value={colorMode1}>
      <ThemeProvider theme={theme as Theme}>
     */}    <CssBaseline />
      <div className='header'>
        <ScrollableTabs items={items} value={value} setValue={setValue} handleChange={handleChange} />
      </div>

      <div className='main' style={{ overflow: 'auto' }}>
        <DevicesContext.Provider value={{ devices: devices?.data, selectedItem: selectedDevice, setSelectedItem: setSelectedDevice }}>
          <DeviceTypesContext.Provider value={{ deviceTypes: deviceTypes?.data, selectedItem: selectedDeviceTypes, setSelectedItem: setSelectedDeviceTypes }}>
            <Paper sx={{ height: "100%" }}>
              {value === 0 && <DeviceTab />}
              {value === 1 && (<DeviceTypeTab />)}
              {value === 2 && (<div>I am tab 2</div>)}
            </Paper>
          </DeviceTypesContext.Provider>
        </DevicesContext.Provider>

      </div>
      {/* 
      </ThemeProvider>
    </ColorModeContext.Provider> */}
    </>


  )
}

export default AdminPage
