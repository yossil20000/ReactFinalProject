  import { DEVICE_MT, EDeviceServiceState } from "../Interfaces/API/IDevice";
import { ERange, tRangeResult } from "../Types/Number.extensions";
export type TDeviceServiceStatus = {
  description: string;
  validation: number;
}
function GetDeviceAnnualState(due_date: Date, tollerance: number) : TDeviceServiceStatus {
  if(due_date === undefined || tollerance === undefined) {
    return {description: "No Device Selected", validation: 2};
  }
  const now = new Date();
  const dayDiff = due_date.getDayDiff(now);
  /* const engineDiff = engienRangeResult.diff;
  const engineRange = engienRangeResult.range;
  
  if (engineRange == ERange.ABOVE || dayDiff <= 0) {
    return EDeviceServiceState.NEED_SERVICE_NOW;
  }
  if(engineRange == ERange.IN_RANGE) {
    return EDeviceServiceState.NEED_SERVICE_IN_RANGE;

  } */

  if (dayDiff < tollerance ) {
    return {description: `Annual service due in ${dayDiff} days`, validation: EDeviceServiceState.NEED_SERVICE_SOON};
  }
  return {description: "Device OK", validation: EDeviceServiceState.OK} ;  
}
  function getDeviceServiceStatus(engien_meter:number,maintanance_next_meter: number,next_meter_tollerance:number,due_date: Date,maintanance_type: DEVICE_MT  ,device_name:string='CGC'): TDeviceServiceStatus[] {
    const engienServiceWarningHours = 10;
    //maintanance_next_meter= engien_meter -1; // For Testing Purpose
    //next_meter_tollerance=5; // For Testing Purpose
    const deviceServiceStatus : TDeviceServiceStatus[] = [];
    CustomLogger.log("getDeviceServiceStatus/",engien_meter,maintanance_next_meter,next_meter_tollerance) 
    if (device_name === undefined || engien_meter === undefined || maintanance_next_meter === undefined || next_meter_tollerance === undefined || due_date === undefined)
      return [{description: "No Device Selected", validation: EDeviceServiceState.UNKNOWN}];
    let deviceServiceRange = engien_meter.IsInRange(maintanance_next_meter , maintanance_next_meter + next_meter_tollerance) 
    const deviceState = GetDeviceAnnualState(new Date(due_date), next_meter_tollerance) ;
   deviceServiceStatus.push(deviceState);
    CustomLogger.info("getDeviceServiceStatus/deviceState, device", deviceState, device_name)  
  
  if (deviceServiceRange.range == ERange.ABOVE ) {
    deviceServiceStatus.push({description: `Service: ${maintanance_type} At ${maintanance_next_meter} (Permit Tolerance: ${next_meter_tollerance} Hr) Current TACH: ${engien_meter}`,validation: EDeviceServiceState.NEED_SERVICE_NOW});
  }
  else if(deviceServiceRange.range == ERange.IN_RANGE) {
    deviceServiceStatus.push({description: `Service: ${maintanance_type} At ${maintanance_next_meter} (Permit Tolerance: ${next_meter_tollerance} Hr) Current TACH: ${engien_meter}`,validation: EDeviceServiceState.NEED_SERVICE_IN_RANGE});

  }
  else if(deviceServiceRange.range == ERange.BELOW && deviceServiceRange.diff >= -engienServiceWarningHours)  {
    deviceServiceStatus.push({description: `Next Service: ${maintanance_type} At ${maintanance_next_meter} (Permit Tolerance: ${next_meter_tollerance} Hr) Current TACH: ${engien_meter}`,validation: EDeviceServiceState.NEED_SERVICE_SOON}) ;
  }
  else {
    deviceServiceStatus.push({description: `Next Service: ${maintanance_type} At ${maintanance_next_meter} (Permit Tolerance: ${next_meter_tollerance} Hr) Current TACH: ${engien_meter}`,validation: EDeviceServiceState.OK}) ;
  }
  return deviceServiceStatus
    
  }
  
  export default getDeviceServiceStatus;