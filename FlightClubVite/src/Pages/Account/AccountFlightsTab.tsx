import { Box, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { useMemo, useState } from 'react';
import { EAction } from '../../Components/Buttons/ActionButtons';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import ColumnGroupingTable, { Column } from '../../Components/ColumnGroupingTable';
import DevicesFlightCombo from '../../Components/Devices/DeviceFlightCombo';
import DevicesCombo from '../../Components/Devices/DevicesCombo';
import { useGetAllFlightsSearchQuery } from '../../features/Flight/flightApi';
import { COrderCreate, IOrderBase, OrdefStatus, OT_OPERATION, OT_REF } from '../../Interfaces/API/IAccount';
import { DEVICE_MET } from '../../Interfaces/API/IDevice';
import IFlight, { FlightStatus } from '../../Interfaces/API/IFlight';

import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';
import CreateOrderDialog from './CreateOrderDialog';
interface IData {
  _id: string;
  date: Date;
  hobbs_start: number
  hobbs_stop: number
  engien_start: number
  engien_stop: number
  order_by: string
}
function createData(
  _id: string,
  date: Date,
  hobbs_start: number,
  hobbs_stop: number,
  engien_start: number,
  engien_stop: number,
  order_by: string
): IData {

  return { _id, date, hobbs_start, hobbs_stop, engien_start, engien_stop, order_by };
}


const columns: Column[] = [
  { id: 'date', label: 'Date', minWidth: 170, isCell: true ,format: (date: Date) : string => {
    return (new Date(date)).toLocaleDateString()
  }},
  {
    id: 'engien_start',
    label: 'EngienStart',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
    isCell: true
  },
  {
    id: 'engien_stop',
    label: 'EngienStop',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
    isCell: true
  },
  {
    id: 'hobbs_start',
    label: 'HobbsStart',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
    isCell: true
  },
  {
    id: 'hobbs_stop',
    label: 'HobbsStop',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
    isCell: true
  },
  {
    id: 'order_by',
    label: 'Order By',
    minWidth: 170,
    align: 'center',
    isCell: true
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'center',
    isCell: true

  },
  {
    id: '_id',
    label: '_id',
    minWidth: 170,
    align: 'center',
    isCell: false

  },
];
function AccountFlightsTab() {
  const [openOrderAdd, setOpenOrderAdd] = useState(false);
  const [order,setOrder] = useState<IOrderBase>(new COrderCreate());
  const [accountFlightFilter, setaccountFlightFilter] = useState({ status: FlightStatus.CREATED })
  const { data, refetch } = useGetAllFlightsSearchQuery(accountFlightFilter);

  const onDeviceChange = (item: InputComboItem, has_hobbs: boolean) => {
    const filter: any = JSON.parse(JSON.stringify(accountFlightFilter));

    delete filter["device"]
    if (item._id != "") {
      filter.device = item._id;
    }
    console.log("AccountFlight/onDeviceChange/filter", filter)
    setaccountFlightFilter(filter)
  }
  const sort = (a:IData , b:IData) : number => {
    return a.engien_start >= b.engien_start ? 1 : -1;
  }
  const getData = useMemo(() => {
    const rows = data?.data.map((row) => createData(row._id, row.date, row.hobbs_start, row.hobbs_stop, row.engien_start, row.engien_stop, `${row.member?.family_name}/${row.member?.member_id}`))
    console.log("AccountFlight/Flight/getData", rows)
    return rows === undefined ? [] : rows;
  }, [data])
  const getPrice = (flight: IFlight): [units: number, pricePeUnit: number, amount: number,discount: number] => {
    let units: number=0, pricePeUnit: number =0 ,discount: number =0, amount: number = 0;
    console.info("AccountFlight/DeviceMeter",flight.device.price.meter ,flight.engien_stop , flight.engien_start,flight)
    if(flight.device.price.meter == DEVICE_MET.ENGIEN){
      units = flight.engien_stop - flight.engien_start;
      console.info("AccountFlight/units",units)
      
    }
    else{
      units = flight.hobbs_stop - flight.hobbs_start;
    }
    discount = isNaN( flight.member?.membership?.hour_disc_percet) ?  0 : flight.member?.membership?.hour_disc_percet;
    discount = flight.device.price.base * (  discount / 100) ;
   amount = units * flight.device.price.base - discount;
    return [units, flight.device.price.base, amount,discount ]
  }
  function CreateOrder(flightId: string): IOrderBase | undefined {
    const flightFound = data?.data.find((item) => item._id === flightId)

    if (flightFound !== undefined) {
      const [units, pricePeUnit, amount,discount] = getPrice(flightFound);
      let order: IOrderBase = {
        order_date: flightFound.date,
        product: flightFound._id,
        units: units,
        pricePeUnit: pricePeUnit,
        discount: Number(discount.toFixed(2)),
        amount: amount,
        orderType: { operation: OT_OPERATION.CREDIT, referance: OT_REF.FLIGHT },
        description: `Flight on ${new Date(flightFound.date).toDateString()} , ${flightFound.description}`,
        status: OrdefStatus.CREATED,
        member: flightFound.member,
        orderBy: `${flightFound.member.family_name} / ${flightFound.member.member_id}`
      }
      return order;
    }
    return undefined;
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    console.log("AccountFlight/ActionButtons/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ORDER:
        if (item !== undefined) {
          const order = CreateOrder(item);
          console.log("AccountFlight/CreateOrder", order)
          if(order !== undefined){
            setOrder(order);
            setOpenOrderAdd(true)
          }
        }
        break;
      case EAction.DELETE:
        /* onDelete(); */
        break;
      case EAction.SAVE:
        /* onSave() */
        break;
    }
  }

  const handleAddClick = async () => {
    setOpenOrderAdd(true);
  }
  const setFlightStatus = (id:string) : void => {

  }
  const handleAddOnSave = (value: IOrderBase) => {
    refetch();
    setOpenOrderAdd(false);
    console.log("AccountFlightPage/handleAddOnSave/value", value);
    

  }
  const handleAddOnClose = () => {
    setOpenOrderAdd(false);
  }
  return (
    <ContainerPage>
      <>
        {openOrderAdd && <CreateOrderDialog  onClose={handleAddOnClose} value={order} open={openOrderAdd} onSave={handleAddOnSave} />}
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"99%"} height={"100%"} gap={2} columns={12}>
              <Grid item xs={6}>
                <DevicesFlightCombo onChanged={onDeviceChange} source={"_accounts/devices"} />

              </Grid >
            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
          <><ColumnGroupingTable rows={getData.sort(sort)} columns={columns} header={[]} action={{ show: [EAction.ORDER], OnAction: onAction, item: "" }} /></>
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

export default AccountFlightsTab
