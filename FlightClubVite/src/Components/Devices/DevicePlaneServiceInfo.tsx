import { Box } from "@mui/system"
import useGetDeviceServiceInfo from "../../hooks/useGetDeviceServiceInfo"
import { customLogger } from "../../customLogging"

function DevicePlaneServiceInfo() {
  const deviceServiceInfo =useGetDeviceServiceInfo("4xCGC")
  customLogger.log("DevicePlaneServiceInfo", deviceServiceInfo?.device.engien_start_meter)
  const DeviceStatus= () => {
    if(deviceServiceInfo?.device.device_id){
      return <div>{deviceServiceInfo?.device.device_id}</div>
    }
    else{
      return <div>Device Service Info not available</div>
    }
  }
  return (
  <Box>
    <DeviceStatus/>
  </Box>  
  )
}

export default DevicePlaneServiceInfo