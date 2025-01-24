import "../../Types/date.extensions"
import baz from '/src/Asset/images/favicon_baz.jpg'
import cgc from '/src/Asset/images/IMG-CGC-1.jpg'
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { useFetchDeviceReportQuery } from '../../features/Device/deviceApiSlice'


function DeviceReport() {
  const { data, isError, error, isLoading } = useFetchDeviceReportQuery("4XCGC")
  console.log("DeviceReport/data", data)
  function getSummary(): JSX.Element {
    if (isLoading) {
      return (<>Loading</>)
    }
    if (isError) {
      return (<>{error}</>)
    }
    if (data?.data && data.data.length == 1) {
      return (
        <>
          {`${data?.data[0].device.device_id} last flight: ${new Date(data?.data[0].date).getDisplayDate()} current TACH: ${data?.data[0].device.engien_meter} next service: ${data?.data[0].device.maintanance.next_meter}`}
        </>
      )
    }
    return (<>Unknown</>)
  }
  function getDetailes(): JSX.Element {
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
            <Card variant="outlined" sx={{height:"100%"}}>
              <CardHeader avatar={<Avatar alt="Baz" src={baz} />} title="Flight Info" />
              <CardContent>
                <Typography variant="h6" component={"div"}>
                  {`Flight by: ${report.member.family_name} ${report.member.first_name}`}
                  <div>{`Engine: ${report.engien_stop} - ${report.engien_start} = ${(report.engien_stop - report.engien_start).toFixed(1)} Hour`}</div>
                  <div>{`Flight Time: ${report.flight_time == 0 ? (report.engien_stop - report.engien_start).toFixed(1) : report.flight_time.toFixed(1)} Hour`}</div>
                  <div>{`Fuel Start: ${report.fuel_start} Galon`}</div>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} display={'flex'} flexDirection={'column'}>
            <Card variant="outlined" sx={{height:"100%"}}>
              <CardHeader avatar={<Avatar alt="Baz" src={cgc} />} title={`${report.device.device_id} Info:`} />
              <CardContent>
                <Typography variant="h6" component={"div"}>
                  <div>{`The airplane is ${report.device.status} , ${report.device.available ? "Available" : "Not Available"} and ${report.device.device_status}`}</div>
                  <div>{`Next Service ${report.device.maintanance.type} on ${report.device.maintanance.next_meter}`}</div>
                  <div>{`Annual on ${new Date(report.device.due_date).getDisplayDate()}`}</div>
                  <div>{`Engine Current TACH ${(report.device.engien_start_meter + data?.data[0].device.engien_meter).toFixed(1)}`}</div>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )
    }
    return (<>Unknown</>)
  }
  return (

    <Accordion>
      <AccordionSummary style={{ fontWeight: "bold" }} expandIcon={<GridExpandMoreIcon />} aria-control="device-report" id='device_report'>
        {getSummary()}
      </AccordionSummary>
      <AccordionDetails>{getDetailes()}</AccordionDetails>
    </Accordion>
  )
}

export default DeviceReport