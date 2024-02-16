import "../../Types/date.extensions"
import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import React from 'react'
import { useFetchDeviceReportQuery } from '../../features/Device/deviceApiSlice'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { Status } from "../../Interfaces/API/IStatus"

function DeviceReport() {
  const { data, isError, error, isLoading } = useFetchDeviceReportQuery("4XCGC")
  console.log("DeviceReport/data", data)
  function getSummary(): ReactJSXElement {
    if (isLoading) {
      return (<>Loading</>)
    }
    if (isError) {
      return (<>{error}</>)
    }
    if (data?.data && data.data.length == 1) {
      return (
        <>
          {`${data?.data[0].device.device_id} last flight: ${new Date(data?.data[0].date).getDisplayDate()} current Engien: ${data?.data[0].device.engien_meter} next service: ${data?.data[0].device.maintanance.next_meter}`}
        </>
      )
    }
    return (<>Unknown</>)
  }
  function getDetailes(): ReactJSXElement {
    if (isLoading) {
      return (<>Loading</>)
    }
    if (isError) {
      return (<>{error}</>)
    }
    if (data?.success && data?.data?.length == 1) {
      const report = data?.data[0]
      return (
        <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
          <Grid item xs={12} md={6} display={'flex'} flexDirection={'column'}>
            <div>Flight Info:</div>
            <div>{`Flight by ${report.member.family_name} ${report.member.first_name}`}</div>
            <div>{`Engien ${report.engien_start} - ${report.engien_stop}`}</div>
            
          </Grid>
          <Grid item xs={12} md={6} display={'flex'} flexDirection={'column'}>
            <div>{`${report.device.device_id} Info:`}</div>
            <div>{`The airplane is ${report.device.status} , ${report.device.available ? "Available" : "Not Available"} and ${report.device.device_status}`}</div>
            <div>{`Next Service ${report.device.maintanance.type} on ${report.device.maintanance.next_meter}`}</div>
            <div>{`Annual on ${new Date(report.device.due_date).getDisplayDate()}`}</div>

          </Grid>
        </Grid>
      )
    }
    return (<>Unknown</>)
  }
  return (

    <Accordion>
      <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-control="device-report" id='device_report'>
        {getSummary()}
      </AccordionSummary>
      <AccordionDetails>{getDetailes()}</AccordionDetails>
    </Accordion>
  )
}

export default DeviceReport