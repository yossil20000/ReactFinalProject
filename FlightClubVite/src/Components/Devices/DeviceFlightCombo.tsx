import { useEffect, useState } from 'react'
import { useFetchDevicsComboQuery } from '../../features/Device/deviceApiSlice';
import useSessionStorage from '../../hooks/useLocalStorage';
import { IDeviceCombo, IDeviceComboFilter } from '../../Interfaces/API/IDevice'
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { InputComboItem } from '../Buttons/ControledCombo';
const filterCombo: IDeviceComboFilter = {
  filter: {
    status: Status.Active
  }
}
export interface IDeviceFlightComboProps {
  onChanged: (item: InputComboItem, has_hobbs: boolean) => void;
  source: string;
  selectedItem?: InputComboItem;
  filter?: any;
}
function DevicesFlightCombo(props: IDeviceFlightComboProps) {
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
      CustomLogger.info("getDeviceDetailed/dvice", device)
      return `Current TACH: ${device.engien_meter} Next Service: ${device.maintanance.next_meter}`
    }
    return "";
  }
  const devicesToItemCombo = (input: IDeviceCombo): InputComboItem => {

    return { lable: input.device_id, _id: input._id, description: getDeviceDetailed(input._id) }
  }
  CustomLogger.log("DevicesFlightCombo/selectedDevice", selectedDevice)
  useEffect(() => {
    CustomLogger.info("DevicesFlightCombo/ Devices.data", data?.data)

    let items = data?.data.map((item) => {
      CustomLogger.info("DevicesFlightCombo/ DeviceItemMap", item)
      return devicesToItemCombo(item)
    });
    CustomLogger.info("DevicesFlightCombo/ DeviceItem", items)
    if (items !== undefined && items.length > 0) {
      setDevicesItem(items);
      setSelectedDevice(items[0])
    }
    if (isError) {
      CustomLogger.error("DevicesFlightCombo/error", error)
    }
  }, [data?.data, isError])
  useEffect(() => {
    if (selectedDevice) {
      const hasHobbs = data?.data.find((device) => selectedDevice._id === device._id)?.has_hobbs;
      onChanged(selectedDevice, hasHobbs === undefined ? false : hasHobbs)
    }

  }, [])
  const onSelectedItem = (item: InputComboItem) => {
    const hasHobbs = data?.data.find((device) => item._id === device._id)?.has_hobbs;
    setSelectedDevice(item);
    CustomLogger.log("DevicesFlightCombo/ DeviceItem", item)
    onChanged(item, hasHobbs === undefined ? false : hasHobbs)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem} selectedItem={selectedDevice === undefined ? null : selectedDevice} items={devicesItems} /* handleComboChange={handleDeviceOnChange} */ title="Devices" />
  )
}

export default DevicesFlightCombo