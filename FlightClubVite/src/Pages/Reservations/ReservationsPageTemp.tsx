import { Box, Grid, IconButton } from '@mui/material'
import React, { useState } from 'react'
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons'
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container'
import FilterListIcon from '@mui/icons-material/FilterList';
import ReservationTable from '../../Components/ReservationTable';

function ReservationsPageTemp() {
  const [openFilter, setOpenFilter] = useState(false)
  const [openAddReservation, setOpenAddReservation] = useState(false);
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.info("AccountExpenseTab/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:

        setOpenAddReservation(true)
        break;
    }
  }
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
              <Grid item xs={1}>
                <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpenFilter(true)}>
                  <FilterListIcon fontSize="inherit" />
                </IconButton>
              </Grid>
              <Grid item xs={3}>
                <ActionButtons OnAction={onAction} show={[EAction.ADD]} item="" display={[{ key: EAction.ADD, value: "Transaction" }]} />
              </Grid>


            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
          <>
            <ReservationTable />
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

export default ReservationsPageTemp