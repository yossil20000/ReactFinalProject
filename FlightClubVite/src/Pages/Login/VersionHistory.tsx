import '../../Types/date.extensions'
import { CssBaseline } from '@mui/material'
import { Container, Box, createTheme } from '@mui/system'
import { DataGrid,GridColDef,GridToolbarContainer } from '@mui/x-data-grid';
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
    {id: 7,version: "2.0.7.0",date: new Date(2024,1,4).getDisplayDate() , "description" : "Transaction add Export, User account add table view, fix transaction DB, add balance history"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 8,version: "2.0.7.1",date: new Date(2024,1,5).getDisplayDate() , "description" : "Fix WAB data,Admin/Member block onSave until return,Flight&Reservation Filter lables "  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 9,version: "2.0.8.1",date: new Date(2024,1,10).getDisplayDate() , "description" : "Change NoticeTab to table view"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 10,version: "2.0.9.0",date: new Date(2024,1,16).getDisplayDate() , "description" : "Home page add last flight info and service info"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 11,version: "2.0.9.1",date: new Date(2024,1,16).getDisplayDate() , "description" : "Fix Add reservation "  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 12,version: "2.0.10.0",date: new Date(2024,1,17).getDisplayDate() , "description" : "Fix version history. Add Payment with referance to Recipe, no Recipe yet. Transaction Table hide column"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 13,version: "2.0.11.0",date: new Date(2024,3,23).getDisplayDate() , "description" : "Add Reservation Month View (as previous site)"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 14,version: "2.0.11.1",date: new Date(2024,3,23).getDisplayDate() , "description" : "Month view show only the selected day items"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 15,version: "2.0.11.2",date: new Date(2024,3,30).getDisplayDate() , "description" : "Add registration page"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 16,version: "2.0.11.3",date: new Date(2024,4,13).getDisplayDate() , "description" : "Convert inner DB"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 17,version: "2.0.11.4",date: new Date(2024,7,11).getDisplayDate() , "description" : "Fix DeviceType in DeviceTab"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 18,version: "2.0.11.5",date: new Date(2024,7,12).getDisplayDate() , "description" : "Members filter by member state. Reciept add description"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 19,version: "2.0.12.0",date: new Date(2024,7,19).getDisplayDate() , "description" : "Add Order Expense Dialog, fix Member Account view"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 20,version: "2.0.12.1",date: new Date(2024,7,20).getDisplayDate() , "description" : "Fix Transaction dialog, Switch D.Balance / S.Balance position"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 21,version: "2.0.12.2",date: new Date(2024,7,20).getDisplayDate() , "description" : "Add flight duration column to flight tab"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 22,version: "2.0.12.3",date: new Date(2024,7,20).getDisplayDate() , "description" : "Fix clean display after Place Flight Order"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 23,version: "2.0.12.4",date: new Date(2024,7,23).getDisplayDate() , "description" : "accont/transaction/add transaction update previous balance"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 24,version: "2.0.12.5",date: new Date(2024,7,27).getDisplayDate() , "description" : "Fix Account/Transaction date filter, add time of transaction"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 25,version: "2.0.13.0",date: new Date(2024,8,24).getDisplayDate() , "description" : "Add Account.Transactions report to PDF"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 26,version: "2.0.13.1",date: new Date(2024,8,24).getDisplayDate() , "description" : "Add Account.Transactions report Quarter Button as filter"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},
    {id: 27,version: "2.0.13.2",date: new Date(2024,8,30).getDisplayDate() , "description" : "Fix Quarter Button display and filter"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 28,version: "2.0.13.3",date: new Date(2024,8,30).getDisplayDate() , "description" : "Add Flight Time Field support loging email or userId"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 29,version: "2.0.13.4",date: new Date(2024,8,31).getDisplayDate() , "description" : "Change Home DeviceInfo. Add Links Tab"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 30,version: "2.0.13.5",date: new Date(2024,9,5).getDisplayDate() , "description" : "Add Fuel Start field to flight information"  ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 31,version: "2.0.14.0",date: new Date(2024,9,6).getDisplayDate() , "description" : "Change HomePage display","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 32,version: "2.0.14.1",date: new Date(2024,9,9).getDisplayDate() , "description" : "Fix Report Calculation" ,"known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 33,version: "2.0.15.0",date: new Date(2024,9,14).getDisplayDate() , "description" : "Fix: Update Flight,Add reservation Multidays,Change Engine to TACH, Member Selection According to loging, Admin has option to see all members by button","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 34,version: "2.0.15.1",date: new Date(2024,9,14).getDisplayDate() , "description" : "Create Reservation: add rulls. not allowed reservation an hour befor current time. date_from not after date_to. not allowed more then 3 days in one reservation","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 35,version: "2.0.15.2",date: new Date(2024,9,14).getDisplayDate() , "description" : "Update Reservation: add rulls. not allowed reservation an hour befor current time. date_from not after date_to. not allowed more then 3 days in one reservation","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 36,version: "2.0.15.3",date: new Date(2024,9,16).getDisplayDate() , "description" : "Fix display reservation from end month to next month","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 37,version: "2.0.15.4",date: new Date(2024,9,21).getDisplayDate() , "description" : "Remove Admin / Accounts Role Tabs from user","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 38,version: "2.0.15.5",date: new Date(2024,9,27).getDisplayDate() , "description" : "Change Password add colors to butto, add error text. Member combo set default","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 39,version: "2.0.15.6",date: new Date(2024,10,4).getDisplayDate() , "description" : "Fix transaction date. Fix REPORT","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 40,version: "2.0.15.7",date: new Date(2024,10,26).getDisplayDate() , "description" : "Fix CalanderView.Reservation not shown(filter problem)","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 41,version: "2.0.15.8",date: new Date(2024,10,29).getDisplayDate() , "description" : "Fix CalanderView Flight end month","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 42,version: "2.0.15.9",date: new Date(2024,11,2).getDisplayDate() , "description" : "Fix UpdateReservation, missing timezone","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 43,version: "2.0.15.10",date: new Date(2025,1,11).getDisplayDate() , "description" : "Fix MonthView filter. Fix CreateReservation Member Selection","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 44,version: "2.0.15.11",date: new Date(2025,1,11).getDisplayDate() , "description" : "Fix Report, Improve Notification","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 45,version: "2.0.15.12",date: new Date(2025,1,13).getDisplayDate() , "description" : "Fix User Select in Creat Reservation","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 46,version: "2.0.16.0",date: new Date(2025,1,24).getDisplayDate() , "description" : "Add Account Statistic TAB for flight statistic","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 46,version: "2.0.16.1",date: new Date(2025,1,25).getDisplayDate() , "description" : "Add report statistic Active selector, add new report include years detailes","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 47,version: "2.0.16.2",date: new Date(2025,2,1).getDisplayDate() , "description" : "Add report statistic Total Column. On Hide year, recalculate % per member","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 48,version: "2.0.16.3",date: new Date(2025,2,1).getDisplayDate() , "description" : "Links Add LLHA Flights Schedual Link, Fix WAB persistance initialize data","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 49,version: "2.0.16.4",date: new Date(2025,3,15).getDisplayDate() , "description" : "Links Add Instructors.","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 50,version: "2.0.17.0",date: new Date(2025,4,25).getDisplayDate() , "description" : "HOME Page Links, WAB default and warning,Account Report fix,Account filter","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 51,version: "2.0.17.1",date: new Date(2025,4,25).getDisplayDate() , "description" : "Last close flight, time zone changed error, expense add sizePerUnit field","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 52,version: "2.0.18.1",date: new Date(2025,6,14).getDisplayDate() , "description" : "Add:expenses reports, Tach duration field,Flight page view,Home page Notice","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 53,version: "2.0.19.0",date: new Date(2025,6,27).getDisplayDate() , "description" : "Add support Engine_fund account. open Account page to user for view only","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 54,version: "2.0.20.0",date: new Date(2025,6,27).getDisplayDate() , "description" : "Fix Transaction, Support Engine Fund Calculation","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 55,version: "2.0.21.0",date: new Date(2025,8,11).getDisplayDate() , "description" : "Create Reservation, update Device info with colors Red,Orange,green","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 56,version: "2.0.22.0",date: new Date(2025,8,14).getDisplayDate() , "description" : "Fix Update Engine last value, Add Oil Added field to flight","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 57,version: "2.0.23.0",date: new Date(2025,8,23).getDisplayDate() , "description" : "Add Service Tollerance option","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 58,version: "2.0.23.1",date: new Date(2025,8,25).getDisplayDate() , "description" : "Server crash when lots Flight. remove the unneeded  data","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 59,version: "2.0.24.0",date: new Date(2025,9,24).getDisplayDate() , "description" : "Fix Add reservation error, Add Hours_0050","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 60,version: "2.0.24.1",date: new Date(2025,10,13).getDisplayDate() , "description" : "Update reservation when change date from don't change date to. Mail try to fix sender","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 61,version: "2.0.24.2",date: new Date(2025,11,8).getDisplayDate() , "description" : "Add Alert in Home and reservation pages","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 62,version: "2.0.25.0",date: new Date(2025,12,1).getDisplayDate() , "description" : "Add Summary section to Type report. Summary calculate the estimate flight expense","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    
    {id: 63,version: "2.0.25.1",date: new Date(2025,12,2).getDisplayDate() , "description" : "Fix Summary section to Type report. Summary calculate the estimate flight expense","known_bug": "Admin/Devices Device need to clear and reselect the device name"},    


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