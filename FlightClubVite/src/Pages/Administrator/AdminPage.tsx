import React, { useMemo, useState } from 'react'
import { useMode } from "../../theme"
import { Box, createTheme, CssBaseline, PaletteMode, Paper } from '@mui/material'
import { amber, grey, deepOrange, red, blue } from '@mui/material/colors';
import ScrollableTabs, { ScrollableTabsItem } from '../../Components/Buttons/ScrollableTabs';
import DeviceTab from './Devices/DeviceTab';
import DeviceTypeTab from './DeviceType/DeviceTypeTab';
import { DevicesContext } from '../../app/Context/DevicesContext';
import { DeviceTypesContext } from '../../app/Context/DeviceTypesContext';
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import { useFetchAllDeviceTypesQuery } from '../../features/DeviceTypes/deviceTypesApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDevice from '../../Interfaces/API/IDevice';
import IDeviceType from '../../Interfaces/API/IDeviceType';
import MemberTab from './Members/MemberTab';
import { useFetchMembersAdminQuery, useFetchMembersComboQuery } from '../../features/Users/userSlice';
import { MembersContext } from '../../app/Context/MemberContext';
import { IMemberAdmin } from '../../Interfaces/API/IMember';
import MembershipTab from './Membership/MembershipTab';
import NoticeTab from './Notice/NoticeTab';
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
  { id: 2, label: "Members" },
  { id: 3, label: "Membership" },
  { id: 4, label: "Notices" }

]

function AdminPage() {
  const [theme1, colorMode1] = useMode()
  const [value, setValue] = useLocalStorage<number>("_adminPage",0);
  const [mode, setMode] = useState<PaletteMode>('light');
  const { data: devices, isError, isLoading, isSuccess, error } = useFetchAllDevicesQuery();
  const { data: members} = useFetchMembersAdminQuery();
  const { data: membersCombo  } = useFetchMembersComboQuery();
  const { data: deviceTypes } = useFetchAllDeviceTypesQuery();
  const [selectedDevice, setSelectedDevice] = useLocalStorage<IDevice | null | undefined>("_admin/selectedDevice", null);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useLocalStorage<IDeviceType | null | undefined>("_admin/selectedDeviceType", null);
  const [selectedMember,setSelectedMember] =useLocalStorage<IMemberAdmin | null>("_admin/selectedMember", null);

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

      <>
      <div className='header'>
        <ScrollableTabs items={items} value={value} setValue={setValue} handleChange={handleChange} />
      </div>
      <div className='main' style={{ overflow: 'auto' ,position:'relative'}}>
        <DevicesContext.Provider value={{ devices: devices?.data, selectedItem: selectedDevice, setSelectedItem: setSelectedDevice ,membersCombo: membersCombo?.data}}>
          <DeviceTypesContext.Provider value={{ deviceTypes: deviceTypes?.data, selectedItem: selectedDeviceTypes, setSelectedItem: setSelectedDeviceTypes }}>
          <MembersContext.Provider value={{selectedItem:selectedMember,setSelectedItem:setSelectedMember,members: members?.data}}>
            <Box height={"100%"} sx={{backgroundColor: "white"}}>
            <Paper style={{height: "100%"}}>
              {value === 0 && <DeviceTab />}
              {value === 1 && (<DeviceTypeTab />)}
              {value === 2 && (<MemberTab/>)}
              {value === 3 && (<MembershipTab/>)}
              {value === 4 && (<NoticeTab/>)}
            </Paper>
            </Box>
            </MembersContext.Provider>
          </DeviceTypesContext.Provider>
        </DevicesContext.Provider>

      </div>

      </>
      
      {/* 
      </ThemeProvider>
    </ColorModeContext.Provider> */}
    </>


  )
}

export default AdminPage
