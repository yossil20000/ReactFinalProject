import { Box, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { useMemo, useState } from 'react';
import { EAction } from '../../Components/Buttons/ActionButtons';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import ColumnGroupingTable, { Column } from '../../Components/ColumnGroupingTable';
import DevicesCombo from '../../Components/Devices/DevicesCombo';
import { useGetAllFlightsSearchQuery } from '../../features/Flight/flightApi';
import IFlight, { FlightStatus } from '../../Interfaces/API/IFlight';

import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';
interface IData {
  _id:string;
  date_from: Date;
  date_to: Date;
  hobbs_start: number
  hobbs_stop: number
  engien_start: number
  engien_stop: number
}
function createData(
  _id:string,
  date_from: Date,
    date_to: Date,
    hobbs_start: number,
    hobbs_stop: number,
    engien_start: number,
    engien_stop: number
): IData {
  
  return { _id,date_from,date_to,hobbs_start,hobbs_stop,engien_start,engien_stop };
}


const columns: Column[] = [
  { id: 'date_from', label: 'From', minWidth: 170 ,isCell:true},
  { id: 'date_to', label: 'To', minWidth: 100 ,isCell:true},
  {
    id: 'engien_start',
    label: 'EngienStart',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
    isCell:true
  },
  {
    id: 'engien_stop',
    label: 'EngienStop',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
    isCell:true
  },
  {
    id: 'hobbs_start',
    label: 'HobbsStart',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
    isCell:true
  },
  {
    id: 'hobbs_stop',
    label: 'HobbsStop',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
    isCell:true
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'center',
    isCell:true
   
  },
  {
    id: '_id',
    label: '_id',
    minWidth: 170,
    align: 'center',
    isCell:false
   
  },
];
function AccountFlights() {
  const [accountFlightFilter,setaccountFlightFilter] = useState({status: FlightStatus.CREATED})
  const {data} = useGetAllFlightsSearchQuery(accountFlightFilter);
  const onDeviceChange = (item: InputComboItem) => {
  const filter: any = JSON.parse(JSON.stringify(accountFlightFilter));
  
  delete filter["device"]
  if(item._id != ""){
    filter.device = item._id;
  }
  console.log("Account/onDeviceChange/filter",filter)
   setaccountFlightFilter(filter)
  }
  const getData = useMemo(() => {
    const rows = data?.data.map((row) => createData(row._id,row.date_from,row.date_to,row.hobbs_start,row.hobbs_stop,row.engien_start,row.engien_stop))
    console.log("Account/Flight/getData",rows)
    return rows === undefined ? [] : rows;
},[data])
function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  event?.defaultPrevented
  console.log("Account/ActionButtons/onAction", event?.target, action)
  switch (action) {
    case EAction.ADD:
      
      break;
    case EAction.DELETE:
      /* onDelete(); */
      break;
    case EAction.SAVE:
      /* onSave() */
      break;
  }
}
  return (
    <ContainerPage>
    <>
      <ContainerPageHeader>
      <Box marginTop={2}>
          <Grid container width={"99%"} height={"100%"} gap={2} columns={12}>
            <Grid item xs={6}>
              <DevicesCombo onChanged={onDeviceChange} source={"_accounts/devices"}  />
              
            </Grid >
          </Grid>
        </Box>
      </ContainerPageHeader>
      <ContainerPageMain>
        <><ColumnGroupingTable rows={getData} columns={columns} header={[]} action={{show: [ EAction.SAVE, EAction.ADD],OnAction:onAction}} /></>
      </ContainerPageMain>
      <ContainerPageFooter>
        <>
         footer
        </>
      </ContainerPageFooter>
    </>

  </ContainerPage>
  )
}

export default AccountFlights
