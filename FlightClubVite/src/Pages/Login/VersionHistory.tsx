import '../../Types/date.extensions'
import { Checkbox, CssBaseline, FormControlLabel } from '@mui/material'
import { Container, Box, createTheme, width } from '@mui/system'
import { DataGrid,GridColDef,GridRowProps,GridToolbar,GridToolbarContainer } from '@mui/x-data-grid';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
const theme = createTheme();

export interface IVersionHistoryProps {
  show: boolean
}
function VersionHistory({show=false} : IVersionHistoryProps) {
 
  const columns : GridColDef[] =[
    {field: "id", type: "string" , headerName: "Id", description: "Index",minWidth:80},
    {field: "version", type: "string" , headerName: "Version", description: "Vesrion",minWidth:120},
    {field: "date", type: "Date" , headerName: "Issue Date", description: "Vesrion Release Date",minWidth:140},
    {field: "description", type: "string" , headerName: "Description", description: "Vesrion Description", minWidth:140 , flex:2}, 
    {field: "known_bug", type: "string" , headerName: "Known bug", description: "Known bugs to issue date" , minWidth:140, flex:2}
    
  ]
  const rows   = [
    {id: 1,version: "2.0.4.0",date: new Date(2023,11,19).getDisplayDate() , "description" : "Added Scheduler"  ,"known_bug": "Admin/Devices Device Type need to reselect for update/save operation"},
    {id: 2,version: "2.0.5.0",date: new Date(2024,0,6).getDisplayDate() , "description" : "Add version history. Add Admin/Services list"  ,"known_bug": "Admin/Devices Device Type need to reselect for update/save operation"},
    {id: 3,version: "2.0.5.1",date: new Date(2024,0,9).getDisplayDate() , "description" : "Fix AccountAccounts filter by member type"  ,"known_bug": "Admin/Devices Device Type need to reselect for update/save operation"},
    {id: 4,version: "2.0.5.2",date: new Date(2024,0,10).getDisplayDate() , "description" : "Add WAB persidtance"  ,"known_bug": "Admin/Devices Device Type need to reselect for update/save operation"},
    {id: 5,version: "2.0.5.3",date: new Date(2024,0,12).getDisplayDate() , "description" : "Fix Account/Device Types select"  ,"known_bug": "Admin/Devices Devicee need to clear and reselect the device name"},
    {id: 6,version: "2.0.6.0",date: new Date(2024,0,12).getDisplayDate() , "description" : "Account/Flight add date filter"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    
  ]
  function CustomToolbar() {
    return (
      <GridToolbarContainer>

        {/* <GridToolbarExport /> */}
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        {show === true ? 
        (
          <Container component="main" >
          <CssBaseline />
          <Box
            sx={{
              width: "100%",
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <DataGrid sx={{width: "100%"}} slots={{
              toolbar: CustomToolbar
            }}
            pageSizeOptions={[5, 10,15, 20,50,100]}
            rows={show ? rows : []} columns={columns } getRowHeight={() => 'auto'}/>
          </Box>
        </Container>
        ) : (null)}

      </ThemeProvider>
    </>
  )
}

export default VersionHistory