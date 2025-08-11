import { useEffect, useState } from "react";
import { useFetchDeviceReportQuery } from "../features/Device/deviceApiSlice";
import { customLogger } from "../customLogging";
import { IDeviceReport } from "../Interfaces/API/IDevice";

export interface IDeviceServiceInfo {

}
export default function useGetDeviceServiceInfo(deviceId: string ="4XCGC" ): IDeviceReport | undefined {
  const { data, isError, error, isLoading } = useFetchDeviceReportQuery("4XCGC")
  const [deviceServiceInfo, setDeviceServiceInfo] = useState<IDeviceReport>()
  useEffect(() => {
    customLogger.log("useGetDeviceServiceInfo_data", data)
    if(data?.data?.[0]) {
      setDeviceServiceInfo(data.data[0])
    }
  }, [data])
  return deviceServiceInfo;
}