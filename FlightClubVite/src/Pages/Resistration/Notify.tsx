import { Grid } from '@mui/material'
import React from 'react'
import { INotify } from '../../Interfaces/API/INotification'
export interface INotifyProps {
  notify: INotify
}
function Notify({notify} : INotifyProps) {
  return (
    <Grid container columns={4}>
      <Grid item xs={1}>
        {notify.event}
      </Grid>
      <Grid item xs={3}>

      </Grid>
    </Grid>
  )
}

export default Notify