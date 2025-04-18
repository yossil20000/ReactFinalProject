import React, { useState } from 'react'
import { Box, createTheme, CssBaseline, PaletteMode, Paper } from '@mui/material'
import { amber, grey, deepOrange, red, blue } from '@mui/material/colors';
import ScrollableTabs, { ScrollableTabsItem } from '../../Components/Buttons/ScrollableTabs';
import DeviceTab from './Devices/DeviceTab';
import DeviceTypeTab from './DeviceType/DeviceTypeTab';
import { DevicesContext } from '../../app/Context/DevicesContext';
import { DeviceTypesContext } from '../../app/Context/DeviceTypesContext';
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import { useFetchAllDeviceTypesQuery } from '../../features/DeviceTypes/deviceTypesApiSlice';
import useSessionStorage from '../../hooks/useLocalStorage';
import IDevice from '../../Interfaces/API/IDevice';
import IDeviceType from '../../Interfaces/API/IDeviceType';
import MemberTab from './Members/MemberTab';
import { useFetchMembersAdminQuery, useFetchMembersComboQuery } from '../../features/Users/userSlice';
import { MembersContext } from '../../app/Context/MemberContext';
import { IMemberAdmin } from '../../Interfaces/API/IMember';
import MembershipTab from './Membership/MembershipTab';
import NoticeTab from './Notice/NoticeTab';
import ServicesTab from './Services/ServicesTab';

const items: ScrollableTabsItem[] = [
  { id: 0, label: "Devices" },
  { id: 1 ,label: "Services"},
  { id: 2, label: "Device Type" },
  { id: 3, label: "Members" },
  { id: 4, label: "Membership" },
  { id: 5, label: "Notices" }

]

function AdminPage() {
  const [value, setValue] = useSessionStorage<number>("_adminPage", 0);
  const { data: devices, isError, isLoading, isSuccess, error } = useFetchAllDevicesQuery();
  const { data: members } = useFetchMembersAdminQuery();
  const { data: membersCombo } = useFetchMembersComboQuery({});
  const { data: deviceTypes } = useFetchAllDeviceTypesQuery();
  const [selectedDevice, setSelectedDevice] = useSessionStorage<IDevice | null | undefined>("_admin/selectedDevice", null);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useSessionStorage<IDeviceType | null | undefined>("_admin/selectedDeviceType", null);
  const [selectedMember, setSelectedMember] = useSessionStorage<IMemberAdmin | null>("_admin/selectedMember", null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    CustomLogger.log("AdminPage/newValue", newValue)
  }

  return (
    <>
      <CssBaseline />
      <>
        <div className='header'>
          <ScrollableTabs items={items} value={value} setValue={setValue} handleChange={handleChange} />
        </div>
        <div className='main' style={{ overflow: 'auto', position: 'relative', height: '100%' }}>
          <DevicesContext.Provider value={{ devices: devices?.data, selectedItem: selectedDevice, setSelectedItem: setSelectedDevice, membersCombo: membersCombo?.data }}>
            <DeviceTypesContext.Provider value={{ deviceTypes: deviceTypes?.data, selectedItem: selectedDeviceTypes, setSelectedItem: setSelectedDeviceTypes }}>
              <MembersContext.Provider value={{ selectedItem: selectedMember, setSelectedItem: setSelectedMember, members: members?.data }}>
                <Box height={"100%"} sx={{ backgroundColor: "white" }}>
                  <Paper style={{ height: "100%" }}>
                    {value === 0 && <DeviceTab />}
                    {value === 1 && <ServicesTab />}
                    {value === 2 && (<DeviceTypeTab />)}
                    {value === 3 && (<MemberTab />)}
                    {value === 4 && (<MembershipTab />)}
                    {value === 5 && (<NoticeTab />)}
                  </Paper>
                </Box>
              </MembersContext.Provider>
            </DeviceTypesContext.Provider>
          </DevicesContext.Provider>
        </div>
      </>
    </>
  )
}

export default AdminPage
