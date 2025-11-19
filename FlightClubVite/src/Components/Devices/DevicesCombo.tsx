import '../../Types/date.extensions'
import '../../Types/Number.extensions'
import { useEffect, useState } from 'react'
import { useFetchDevicsComboQuery } from '../../features/Device/deviceApiSlice';
import useSessionStorage from '../../hooks/useLocalStorage';
import { IDeviceCombo, IDeviceComboFilter } from '../../Interfaces/API/IDevice'
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';
import getDeviceServiceStatus, { TDeviceServiceStatus } from '../../Utils/deviceUtils';
const filterCombo: IDeviceComboFilter = {
  filter: {
    status: Status.Active
  }
}

function DevicesCombo(props: ComboProps) {
  const { onChanged, source, filter } = props
  const { data, isError, isLoading, error } = useFetchDevicsComboQuery(filter !== undefined ? filterCombo : {});

  const [devicesItems, setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useSessionStorage<InputComboItem | undefined>(`_${source}/Device`, undefined);

  function getDeviceDetailed(_id: string | undefined): TDeviceServiceStatus[] {
    
    CustomLogger.log("getDeviceDetailed", _id)
    if (_id === undefined)
      return [{description: "No Device Selected", validation: 2}];
    const device: IDeviceCombo | undefined = data?.data?.find((i) => i._id == _id);
    if (device === undefined)
      return [{description: "No Device Selected", validation: 2}];   
    return getDeviceServiceStatus(device.engien_meter, device?.maintanance.next_meter, device?.maintanance.next_meter_tollerance, new Date(device ? device.due_date : new Date()), device?.maintanance.type, device?.device_id)
  }
  const devicesToItemCombo = (input: IDeviceCombo): InputComboItem => {
    const details = getDeviceDetailed(input._id).sort((a,b) => b.validation - a.validation);
    return { label: input.device_id, _id: input._id, description: details[0].description, validation: details[0].validation }
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