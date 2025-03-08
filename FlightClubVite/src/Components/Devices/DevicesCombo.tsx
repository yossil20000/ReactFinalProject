import { useEffect, useState, useId } from 'react'
import { useFetchDevicsComboQuery } from '../../features/Device/deviceApiSlice';
import useSessionStorage from '../../hooks/useLocalStorage';
import { IDeviceCombo, IDeviceComboFilter } from '../../Interfaces/API/IDevice'
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';
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
  function getDeviceDetailed(_id: string | undefined): string {
    CustomLogger.log("getDeviceDetailed", _id)
    if (_id === undefined)
      return "";
    const device: IDeviceCombo | undefined = data?.data?.find((i) => i._id == _id);
    if (device) {
      CustomLogger.info("getDeviceDetailed/device", device)
      return `Current TACH: ${device.engien_meter} Next Service: ${device.maintanance.next_meter}`
    }
    return "";
  }
  const devicesToItemCombo = (input: IDeviceCombo): InputComboItem => {

    return { lable: input.device_id, _id: input._id, description: getDeviceDetailed(input._id) }
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