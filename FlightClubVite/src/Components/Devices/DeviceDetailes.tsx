import { Box, Typography } from '@mui/material';
import { textAlign } from '@mui/system';
import React, { useEffect } from 'react'
import { useFetchDeviceQuery } from '../../features/Device/deviceApiSlice';
import IDevice from '../../Interfaces/API/IDevice'
import FlightIcon from '@mui/icons-material/Flight';

interface IDeviceDetails {
  id_device: string
}
function DeviceDetailes(props: IDeviceDetails) {
 const {id_device} = props
 const { data, isError, isLoading, error } = useFetchDeviceQuery(id_device);
 function RenderDetailes() {

  if(data?.data === null || data?.data === undefined || Array.isArray(data?.data))
  {
    return (<>No Data</>)
  }
  if(data?.data )
  {
    console.log("RenderDetailes/data",data.data,id_device)
    return (<>
    <Typography >Divice Detailes</Typography>:
    <Typography display="flex">Price : <Typography><b>{data?.data?.price.base} per 1 hour {data?.data?.price.meter}</b></Typography></Typography>
    <Typography display="flex">Seats : <Typography><b>{data?.data?.details.seats}</b></Typography></Typography>
    <Typography display="flex">Color : <Typography><b>{data?.data?.details.color}</b></Typography></Typography>
    <Typography display="flex">Fuel Quantity : <Typography><b>{data?.data?.details.fuel.quantity} [<b>{data?.data?.details.fuel.units}</b>]</b></Typography></Typography>
    <Typography display="flex">Instruments : <Typography><b>{data?.data?.details.instruments.join(",")}</b></Typography></Typography>
    <Typography display="flex">Image : <Typography> {data?.data?.details.image === "" 
    ? (<FlightIcon/>)
    :
     (<img src={data?.data?.details.image === "" ? "": data?.data?.details.image} alt='No Image'></img>)
     }</Typography></Typography>
   
    

    
    </>)
  }
  return (
    <>{id_device}</>
  )
 }
 useEffect(() => {
  
 },[data,isLoading])
  return (
    <RenderDetailes/>
  )
}

export default DeviceDetailes