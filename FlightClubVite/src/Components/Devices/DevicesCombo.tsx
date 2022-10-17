
import { useEffect, useState } from 'react'
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import IDevice from '../../Interfaces/API/IDevice'
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'
interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
function DevicesCombo(props : ComboProps) {
  const {onChanged} = props
  const { data, isError, isLoading, error } = useFetchAllDevicesQuery();
  
  const [devicesItems,setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<InputComboItem | undefined>();
  
  const devicesToItemCombo = (input: IDevice): InputComboItem => {
    return {  lable: input.device_id, _id: input._id }
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
    
    console.log("DevicesCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedDevice}  items={devicesItems} /* handleComboChange={handleDeviceOnChange} */ title="Devices" />
  )
}

export default DevicesCombo