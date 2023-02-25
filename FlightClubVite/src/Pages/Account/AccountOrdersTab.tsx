
import { Box, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { useState } from 'react';
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import OrderTable from '../../Components/OrderTable';

import FilterListIcon from '@mui/icons-material/FilterList';
import useLocalStorage from '../../hooks/useLocalStorage';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';
import { SetProperty } from '../../Utils/setProperty';
import GeneralDrawer from '../../Components/GeneralDrawer';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DatePickerDate from '../../Components/Buttons/DatePickerDate';
import { from_to_Filter, IOrderTableFilter } from '../../Utils/filtering';
import MembersCombo from '../../Components/Members/MembersCombo';

function AccountOrdersTab() {
  const [openFilter, setOpenFilter] = useState(false)
  const [selectedClubAccount, setSelectedClubAccount] = useLocalStorage<InputComboItem | null>("_accountOrder/selectedClubAccount", null)
  const [selectedMember, setSelectedMember] = useLocalStorage<InputComboItem | null>("_accountOrder/selectedMember", null)
 
  const [filter, setFilter] = useState<IOrderTableFilter>(from_to_Filter(new Date()));


  const OnSelectedClubAccount = (item: InputComboItem): void => {
    console.log("AccountOrdersTab/OnSelectedClubAccount/item", item)
    setSelectedClubAccount(item);
  }
  const OnselectedMember = (item: InputComboItem): void => {
    console.log("AccountOrdersTab/OnselectedMember/item", item)
    setSelectedMember(item);
  }
  const onDateChanged = (key: string, value: Date | null) => {
    console.log("AccountOrdersTab/onDateChanged", key, value)
    const newFilter = SetProperty(filter,key,value);
    setFilter(newFilter)
  }
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
              <Grid item xs={2}>
                <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpenFilter(true)}>
                  <FilterListIcon fontSize="inherit" />
                </IconButton>
              </Grid>
              <Grid item xs={4}  >
                <ClubAccountsCombo onChanged={OnSelectedClubAccount} source={"_accountOrder/selectedClubAccoun"} />

              </Grid >
            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
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
                <ListItem>
                <MembersCombo onChanged={OnselectedMember} source={'_accountOrder'}/>
                
                </ListItem>
              </List>


            </GeneralDrawer>
            <OrderTable selectedMember={selectedMember} selectedClubAccount={selectedClubAccount} filter={filter} />
          </>
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

export default AccountOrdersTab
