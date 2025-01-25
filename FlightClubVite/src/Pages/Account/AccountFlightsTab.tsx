import '../../Types/date.extensions'
import { Box, duration, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, TablePagination } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { EAction } from '../../Components/Buttons/ActionButtons';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import ColumnGroupingTable, { Column } from '../../Components/ColumnGroupingTable';
import DevicesFlightCombo from '../../Components/Devices/DeviceFlightCombo';
import { useGetAllFlightsSearchQuery } from '../../features/Flight/flightApi';
import { COrderCreate, IOrderBase, orderDescription, OrderStatus, OT_OPERATION, OT_REF } from '../../Interfaces/API/IAccount';
import { DEVICE_MET } from '../../Interfaces/API/IDevice';
import IFlight from '../../Interfaces/API/IFlight';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';
import CreateFlightOrderDialog from './CreateFlightOrderDialog';
import FullScreenLoader from '../../Components/FullScreenLoader';
import MembersCombo from '../../Components/Members/MembersCombo';
import { UseIsAuthorized, IRequireAuthProps } from '../../Components/RequireAuth'
import { MemberType, Role } from '../../Interfaces/API/IMember';
import { useAppSelector } from '../../app/hooks';
import { DateRangeIcon } from '@mui/x-date-pickers';
import DatePickerDate from '../../Components/Buttons/DatePickerDate';
import FilterListIcon from '@mui/icons-material/FilterList';
import GeneralDrawer from '../../Components/GeneralDrawer';
import { SetProperty } from '../../Utils/setProperty';
import { IDateFilter } from '../../Interfaces/IDateFilter';
import { IAccountFlightFilter, from_to_year_Filter, getAccountFlightFilter } from '../../Utils/filtering';
interface IData {
  _id: string;
  date: Date;
  hobbs_start: number
  hobbs_stop: number
  duration: number
  engien_start: number
  engien_stop: number
  order_by: string
}


function createData(
  _id: string,
  date: Date,
  hobbs_start: number,
  hobbs_stop: number,
  duration:number,
  engien_start: number,
  engien_stop: number,
  order_by: string
): IData {

  return { _id, date, hobbs_start, hobbs_stop,duration, engien_start, engien_stop, order_by };
}

const columns: Column[] = [
  {
    id: '_id',
    label: '_id',
    minWidth: 170,
    align: 'center',
    isCell: true

  },
  {
    id: 'date', label: 'Date', minWidth: 170, isCell: true, format: (date: Date): string => {
      return (new Date(date)).getDisplayDate()
    }
  },
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
    id: 'duration',
    label: 'Duration',
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

];

function AccountFlightsTab() {
  const isAuthorized = UseIsAuthorized({ roles: [Role.desk, Role.admin, Role.account] })
  const [openFilter, setOpenFilter] = useState(false)
  const [filter, setFilter] = useState<IDateFilter>({ ...from_to_year_Filter(new Date()) });
  const [openOrderAdd, setOpenOrderAdd] = useState(false);
  const [order, setOrder] = useState<IOrderBase>(new COrderCreate());
  const [accountFlightFilter, setaccountFlightFilter] = useState<IAccountFlightFilter>(getAccountFlightFilter())
  const { data, isError, error, isLoading, refetch } = useGetAllFlightsSearchQuery(accountFlightFilter);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [selectedMember, setSelectedMember] = useState<InputComboItem>()
  const [lastItem,setLastItem] =useState<IOrderBase | null>(null)
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const filterFlight = (flight: IFlight): boolean => {
    if (selectedMember?.lable != "") {
      return flight.member._id == selectedMember?._id
    }
    return true;
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onMemberChanged = (item: InputComboItem) => {
    setSelectedMember(item)
    setPage(0)
  }

  const sort = (a: IData, b: IData): number => {
    return a.engien_start >= b.engien_start ? 1 : -1;
  }
  const getData = useMemo(() => {
    let rows = data?.data.filter(filterFlight).filter((item) => lastItem != null ? lastItem.product != item._id : true).map((row) => createData(row._id, row.date, row.hobbs_start, row.hobbs_stop, row.duration == 0 ? row.engien_stop - row.engien_start : row.duration,row.engien_start, row.engien_stop, `${row.member?.family_name}/${row.member?.member_id}`))
    CustomLogger.info("AccountFlight/Flight/getData", rows)
    rows = rows === undefined ? [] : rows;
    setCount(rows.length)
    return rows;
  }, [data, selectedMember,lastItem])

  const getPrice = (flight: IFlight): [units: number, pricePeUnit: number, amount: number, discount: number] => {
    let units: number = 0, pricePeUnit: number = 0, discount: number = 0, amount: number = 0;
    console.info("AccountFlight/DeviceMeter", flight.device.price.meter, flight.engien_stop, flight.engien_start, flight)
    if (flight.device.price.meter == DEVICE_MET.ENGIEN) {
      units = flight.engien_stop - flight.engien_start;
      console.info("AccountFlight/units", units)

    }
    else {
      units = flight.hobbs_stop - flight.hobbs_start;
    }
    discount = isNaN(flight.member?.membership?.hour_disc_percet) ? 0 : flight.member?.membership?.hour_disc_percet;
    discount = flight.device.price.base * (discount / 100);
    amount = units * flight.device.price.base - discount;
    return [units, flight.device.price.base, amount, discount]
  }
  function CreateOrder(flightId: string): IOrderBase | undefined {
    const flightFound = data?.data.find((item) => item._id === flightId)

    if (flightFound !== undefined) {
      const [units, pricePeUnit, amount, discount] = getPrice(flightFound);
      const description: orderDescription = {
        operation: 'FLIGHT',
        date: (new Date(flightFound.date)).getDisplayDate(),
        engien_start: flightFound.engien_start,
        engien_stop: flightFound.engien_stop,
        total: Number((flightFound.engien_stop - flightFound.engien_start).toFixed(2)),
        description: flightFound.description
      }
      let order: IOrderBase = {
        order_date: flightFound.date,
        product: flightFound._id,
        units: Number(units.toFixed(2)),
        pricePeUnit: Number(pricePeUnit.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        amount: Number(amount.toFixed(2)),
        orderType: { operation: OT_OPERATION.CREDIT, referance: OT_REF.FLIGHT },
        description: JSON.stringify(description),
        status: OrderStatus.CREATED,
        member: flightFound.member,
        orderBy: `${flightFound.member.family_name} / ${flightFound.member.member_id}`
      }
      return order;
    }
    return undefined;
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.log("AccountFlight/ActionButtons/onAction", event?.target, action, item)
    setLastItem(null)
    switch (action) {
      case EAction.ORDER:
        if (item !== undefined) {
          const order = CreateOrder(item);
          CustomLogger.info("AccountFlight/CreateOrder", order)
          if (order !== undefined) {
            setOrder(order);
            setOpenOrderAdd(true)
          }
        }
        break;
    }
  }

  const handleAddOnSave = (value: IOrderBase) => {
    setLastItem(value)
    refetch();
    setOpenOrderAdd(false);
    CustomLogger.log("AccountFlightPage/handleAddOnSave/value", value);
  }

  const handleAddOnClose = () => {
    setOpenOrderAdd(false);
  }
  if (isLoading) {
    CustomLogger.info('AccountFlightPage/isLoading', isLoading)
    return (
      <div className='main' style={{ overflow: 'auto' }}>
        <FullScreenLoader />
      </div>
    )
  }
  if (error) {
    if ('status' in error) {
      // you can access all properties of `FetchBaseQueryError` here
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
      CustomLogger.error('AccountFlightPage/error', errMsg)
      return (
        <div>
          <div>AccountFlightPage</div>
          <div>An error has occurred:</div>
          <div>{errMsg}</div>
        </div>
      )
    } else {
      // you can access all properties of `SerializedError` here
      return <div>{error.message}</div>
    }
  }
  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.log("AccountFlightTab/onDateChanged", key, value)
    if (value == null)
      return;
    const newFilter = SetProperty(accountFlightFilter, key, new Date(value));
    setaccountFlightFilter(newFilter)
    CustomLogger.log("AccountFlightTab/onDateChanged", newFilter)
  }
  const onDeviceChange = (item: InputComboItem, has_hobbs: boolean) => {
    CustomLogger.log("AccountFlightTab/onDateChanged", item)
    
    const newFilter = SetProperty(accountFlightFilter, "device",item._id.length == 24 ? item._id : "aaaaaaaaaaaaaaaaaaaaaaaa"  );
    setaccountFlightFilter(newFilter)
    CustomLogger.log("AccountFlightTab/onDateChanged", newFilter)
  }

  return (
    <ContainerPage>
      <>
        {openOrderAdd && <CreateFlightOrderDialog onClose={handleAddOnClose} value={order} open={openOrderAdd} onSave={handleAddOnSave} />}
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"98%"} height={"100%"} gap={2} columns={12}>
              <Grid item xs={12} md={1}>
                <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpenFilter(true)}>
                  <FilterListIcon fontSize="inherit" />
                </IconButton>
              </Grid>
              <Grid item xs={12} sm={5}>
                <DevicesFlightCombo onChanged={onDeviceChange} source={"_accounts/devices"} />
              </Grid >
              <Grid item xs={12} sm={5}>
                <MembersCombo onChanged={onMemberChanged} source={"_accounts/members"} filter={{ filter: { member_type: MemberType.Member } }} />
              </Grid>
            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>

          {/* <><ColumnGroupingTable page={page} rowsPerPage={rowsPerPage} rows={getData.sort(sort)} columns={columns} header={[]} action={{ show: [EAction.ORDER], OnAction: onAction, item: "",disable:[{key: EAction.ORDER,value: !isAuthorized([Role.desk, Role.admin, Role.account] as unknown as IRequireAuthProps)}] }} /></> */}
          <>
            <GeneralDrawer open={openFilter} setOpen={setOpenFilter}>
              <List sx={{ display: 'flex', flexDirection: 'column' }}>
                <ListItem key={"fromDate"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <DateRangeIcon />
                    </ListItemIcon>
                    <DatePickerDate value={filter.from === undefined ? new Date() : filter.from} param="from" lable='From Date' onChange={onDateChanged} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"toDate"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <DateRangeIcon />
                    </ListItemIcon>
                    <DatePickerDate value={filter.to === undefined ? new Date() : filter.to} param={"to"} lable='To Date' onChange={onDateChanged} />
                  </ListItemButton>
                </ListItem>
              </List>
            </GeneralDrawer>
            <ColumnGroupingTable page={page} rowsPerPage={rowsPerPage} rows={getData.sort(sort)} columns={columns} header={[]} action={{ show: [EAction.ORDER], OnAction: onAction, item: "", disable: [{ key: EAction.ORDER, value: !isAuthorized }] }} />
          </>
        </ContainerPageMain>
        <ContainerPageFooter>
          <Grid container columns={1}>
            <TablePagination
              rowsPerPageOptions={[1, 5, 10, 25, 100]}
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </ContainerPageFooter>
      </>

    </ContainerPage>
  )
}

export default AccountFlightsTab
