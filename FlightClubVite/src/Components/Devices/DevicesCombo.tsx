
import { useEffect, useState,useId } from 'react'
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDevice from '../../Interfaces/API/IDevice'
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'

interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
function DevicesCombo(props : ComboProps) {
  const id = useId();
  const {onChanged} = props
  const { data, isError, isLoading, error } = useFetchAllDevicesQuery();
  
  const [devicesItems,setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useLocalStorage<InputComboItem | undefined>(`deviceComb/selDevice/${id}`,undefined);
  function getDeviceDetailed(_id: string | undefined) : string {
    console.log("getDeviceDetailed", _id)
    if(_id === undefined)
      return "";
     const device : IDevice | undefined = data?.data?.find((i) => i._id == _id);
     if(device)
     {
      console.log("getDeviceDetailed/dvice",device)
      return `engien_meter: ${device.engien_meter} next_meter: ${device.maintanance.next_meter}`
     }
      
     return "";
  }
  const devicesToItemCombo = (input: IDevice): InputComboItem => {
    return {  lable: input.device_id, _id: input._id,description: getDeviceDetailed(input._id) }
  }
  console.log("DevicesCombo/selectedDevice" , selectedDevice)
  useEffect(() => {
    console.log("DevicesCombo/ Devices.data", data?.data)
    
    let items  =   data?.data.map((item) => devicesToItemCombo(item));
    console.log("DevicesCombo/ DeviceItem", items)
    if (items !== undefined)
      setDevicesItem(items);
  }, [data?.data])
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedDevice(item);
    console.log("DevicesCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedDevice}  items={devicesItems} /* handleComboChange={handleDeviceOnChange} */ title="Devices" />
  )
}

export default DevicesCombo