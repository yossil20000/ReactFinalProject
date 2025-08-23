import '../../Types/date.extensions'
import '../../Types/Number.extensions'
import { useEffect, useState } from 'react'
import { useFetchDevicsComboQuery } from '../../features/Device/deviceApiSlice';
import useSessionStorage from '../../hooks/useLocalStorage';
import { EDeviceServiceState, IDeviceCombo, IDeviceComboFilter } from '../../Interfaces/API/IDevice'
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';
import { ERange, tRangeResult } from '../../Types/Number.extensions';
const filterCombo: IDeviceComboFilter = {
  filter: {
    status: Status.Active
  }
}
function GetDeviceState(due_date: Date, engienRangeResult:tRangeResult,tollerance: number) : EDeviceServiceState {
  if(due_date === undefined || engienRangeResult.range === ERange.UNKNOWN || tollerance === undefined) {
    return EDeviceServiceState.UNKNOWN;
  }
  const now = new Date();
  const dayDiff = due_date.getDayDiff(now);
  const engineDiff = engienRangeResult.diff;
  const engineRange = engienRangeResult.range;
  if (engineRange == ERange.ABOVE || dayDiff <= 0) {
    return EDeviceServiceState.NEED_SERVICE_NOW;
  }
  if(engineRange == ERange.IN_RANGE) {
    return EDeviceServiceState.NEED_SERVICE_IN_RANGE;

  }
  if ((dayDiff < tollerance * 6 && dayDiff > 0) || (engineDiff + tollerance >=0)) {
    return EDeviceServiceState.NEED_SERVICE_SOON;
  }
  return EDeviceServiceState.OK;  
}
function DevicesCombo(props: ComboProps) {
  const { onChanged, source, filter } = props
  const { data, isError, isLoading, error } = useFetchDevicsComboQuery(filter !== undefined ? filterCombo : {});

  const [devicesItems, setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useSessionStorage<InputComboItem | undefined>(`_${source}/Device`, undefined);

  function getDeviceDetailed(_id: string | undefined): {description: string, validation:number} {

    CustomLogger.log("getDeviceDetailed", _id)
    if (_id === undefined)
      return {description: "No Device Selected", validation: 2};
    const device: IDeviceCombo | undefined = data?.data?.find((i) => i._id == _id);
    let deviceServiceRange = device ? device.engien_meter.IsInRange(device.maintanance.next_meter, device.maintanance.next_meter + device.maintanance.next_meter_tollerance) : { range: ERange.UNKNOWN, diff: 0 };
  
   const deviceState = device ? GetDeviceState(new Date(device.due_date), deviceServiceRange, 5) : EDeviceServiceState;
    CustomLogger.info("getDeviceDetailed/deviceState, device", deviceState, device)  
    if (device) {
      CustomLogger.info("getDeviceDetailed/device", device)
      const due_date = new Date(device.due_date)
      return {description: `Service: ${device.maintanance.type} At ${device.maintanance.next_meter} (Permit Tolerance: ${device.maintanance.next_meter_tollerance} Hr) Current TACH: ${device.engien_meter}  \nAnnual On: ${due_date.getDate()}/${due_date.getMonth() + 1}/${due_date.getFullYear()} `,validation: deviceState as number}
    }
    return {description: "No Device Selected", validation: 2};
  }
  const devicesToItemCombo = (input: IDeviceCombo): InputComboItem => {
    const { description, validation } = getDeviceDetailed(input._id);
    return { lable: input.device_id, _id: input._id, description: description, validation: validation }
  }
  CustomLogger.log("DevicesCombo/selectedDevice", selectedDevice)
  useEffect(() => {
    CustomLogger.info("DevicesCombo/ Devices.data", data?.data)

    let items = data?.data.filter(i => i.available).map((item) => {
      
      CustomLogger.info("DevicesCombo/ DeviceItemMap", item)
      
      return devicesToItemCombo(item)
    });
    CustomLogger.log("DevicesCombo/ DeviceItem", items)
    if (items !== undefined) {
      setDevicesItem(items);
      if (items.length > 0 && items.at(0) !== undefined) {
        const item = items.at(0)
        if (item !== undefined) {
          setSelectedDevice(item)
          onSelectedItem(item)
        }
      }
    }

    if (isError) {
      CustomLogger.error("DevicesCombo/error", error)
    }
  }, [data?.data, isError])
  useEffect(() => {
    if (selectedDevice)
      onChanged(selectedDevice)
  }, [])
  const onSelectedItem = (item: InputComboItem) => {
    setSelectedDevice(item);
    CustomLogger.log("DevicesCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem} selectedItem={selectedDevice === undefined ? null : selectedDevice} items={devicesItems} /* handleComboChange={handleDeviceOnChange} */ title="Devices" />
  )
}
export default DevicesCombo