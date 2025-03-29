
import { Box, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { useState } from 'react';
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem, newInputComboItem } from '../../Components/Buttons/ControledCombo';
import OrderTable from '../../Components/OrderTable';

import FilterListIcon from '@mui/icons-material/FilterList';
import useSessionStorage from '../../hooks/useLocalStorage';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';
import { SetProperty } from '../../Utils/setProperty';
import GeneralDrawer from '../../Components/GeneralDrawer';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DatePickerDate from '../../Components/Buttons/DatePickerDate';
import { from_to_year_Filter, IOrderTableFilter } from '../../Utils/filtering';
import MembersCombo from '../../Components/Members/MembersCombo';
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons';
import CreateQuarterDialoq, { ICreateQuarterExpense } from './CreateQuarterDialoq';
import OrderStatusCombo from '../../Components/Buttons/OrderStatusCombo';
import { OrderStatus } from '../../Interfaces/API/IAccount';
import { UseIsAuthorized } from '../../Components/RequireAuth';
import { MemberType, Role } from '../../Interfaces/API/IMember';
import CreateOrderExpenseDialoq, { ICreateOrderExpense } from './CreateOrderExpenseDialoq';

function AccountOrdersTab() {
  const isAuthorized = UseIsAuthorized({ roles: [Role.desk, Role.admin, Role.account] })

  const [openFilter, setOpenFilter] = useState(false)
  const [openAddQuarter, setOpenAddQuarter] = useState(false)
  const [openAddExpense, setOpenAddExpense] = useState(false)
  const [selectedClubAccount, setSelectedClubAccount] = useSessionStorage<InputComboItem | null>("_accountOrder/selectedClubAccount", null)
  const [selectedMember, setSelectedMember] = useSessionStorage<InputComboItem | null>("_accountOrder/selectedMember", null)
  const [filter, setFilter] = useState<IOrderTableFilter>({ ...from_to_year_Filter(new Date()), orderStatus: OrderStatus.CREATED });

  const OnSelectedClubAccount = (item: InputComboItem): void => {
    CustomLogger.log("AccountOrdersTab/OnSelectedClubAccount/item", item)
    setSelectedClubAccount(item);
  }
  const OnselectedMember = (item: InputComboItem): void => {
    CustomLogger.log("AccountOrdersTab/OnselectedMember/item", item)
    setSelectedMember(item);
  }
  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.log("AccountOrdersTab/onDateChanged", key, value)
    if (value == null)
      return;
    const newFilter = SetProperty(filter, key, new Date(value));
    setFilter(newFilter)
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.log("AccountOrdersTab/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:
        //setOpenFlightAdd(true);
        setOpenAddQuarter(true)
        break;
      case EAction.ORDER:
        setOpenAddExpense(true);
        break;
    }
  }
  function handleAddOnClose() {
    setOpenAddQuarter(false);
    setOpenAddExpense(false)
  }
  function handleAddOnSave(item: ICreateQuarterExpense) {
    CustomLogger.log("AccountOrdersTab/item", item)
  }
  function handleAddOnSaveExpense(item: ICreateOrderExpense) {
    CustomLogger.log("AccountOrdersTab/item", item)
  }
  const onOrderStatusChanged = (item: InputComboItem) => {
    CustomLogger.log("AccountOrdersTab/item", item)
    setFilter((prev) => ({ ...prev, orderStatus: item.lable as OrderStatus }))
  }
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
              <Grid item xs={3} >
                <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpenFilter(true)}>
                  <FilterListIcon fontSize="inherit" />
                </IconButton>
              </Grid>
              <Grid item xs={9}  >
                <ClubAccountsCombo onChanged={OnSelectedClubAccount} source={"_accountOrder/selectedClubAccoun"} includesType={[MemberType.Club]} />
              </Grid >
              <Grid item xs={6}>
                <ActionButtons OnAction={onAction} show={[EAction.ADD]} item="" display={[{ key: EAction.ADD, value: "Quarter" }]} disable={[{ key: EAction.ADD, value: !isAuthorized }]} />
              </Grid>
              <Grid item xs={6}>
                <ActionButtons OnAction={onAction} show={[EAction.ORDER]} item="" display={[{ key: EAction.ORDER, value: "Variable Expense" }]} disable={[{ key: EAction.ORDER, value: !isAuthorized }]} />
              </Grid>
            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
          <>
            {openAddQuarter && <CreateQuarterDialoq onClose={handleAddOnClose} open={openAddQuarter} onSave={handleAddOnSave} />}
            {openAddExpense && <CreateOrderExpenseDialoq onClose={handleAddOnClose} open={openAddExpense} onSave={handleAddOnSaveExpense} />}
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
                <ListItem>
                  <OrderStatusCombo onChanged={onOrderStatusChanged} source={'_accountOrder/orderStatus'} selectedItem={{ ...newInputComboItem, lable: filter.orderStatus === undefined ? OrderStatus.CREATED : filter.orderStatus }} />
                </ListItem>
                <ListItem>
                  <MembersCombo onChanged={OnselectedMember} source={'_accountOrder/member'} />
                </ListItem>
              </List>
            </GeneralDrawer>
            <OrderTable selectedMember={selectedMember} selectedClubAccount={selectedClubAccount} filter={filter} />
            
          </>
        </ContainerPageMain>
        <ContainerPageFooter>
          <></>
        </ContainerPageFooter>
      </>
    </ContainerPage>
  )
}

export default AccountOrdersTab
