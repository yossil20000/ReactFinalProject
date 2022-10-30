
import { useEffect, useState,useId } from 'react'
import { useFetchAllDeviceTypesQuery } from '../../features/DeviceTypes/deviceTypesApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDeviceType from '../../Interfaces/API/IDeviceType';
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'

interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
function DeviceTypesCombo(props : ComboProps) {
  const id = useId();
  const {onChanged} = props
  const { data, isError, isLoading, error } = useFetchAllDeviceTypesQuery();
  
  const [devicesItems,setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useLocalStorage<InputComboItem | undefined>(`admin_deviceComb/selDevice/${id}`,undefined);
  function getDeviceDetailed(_id: string | undefined) : string {
    console.log("getDeviceDetailed", _id)
    if(_id === undefined)
      return "";
     const device : IDeviceType | undefined = data?.data?.find((i) => i._id == _id);
     if(device)
     {
      console.log("getDeviceTypeDetailed/dvice",device)
      return `engien_meter: ${device.category} next_meter: ${device.name}`
     }
      
     return "";
  }
  const devicesToItemCombo = (input: IDeviceType): InputComboItem => {
    return {  lable: input.name, _id: input._id,description: getDeviceDetailed(input._id) }
  }
  console.log("DeviceTypesCombo/selectedDevice" , selectedDevice)
  useEffect(() => {
    console.log("DeviceTypesCombo/ Devices.data", data?.data)
    
    let items  =   data?.data.map((item) => devicesToItemCombo(item));
    console.log("DeviceTypesCombo/ DeviceItem", items)
    if (items !== undefined)
      setDevicesItem(items);
      if(isError){
        console.log("DeviceTypesCombo/error", error)
      }
  }, [data?.data,isError])
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedDevice(item);
    console.log("DeviceTypesCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedDevice}  items={devicesItems} /* handleComboChange={handleDeviceOnChange} */ title="Device Types" />
  )
}

export default DeviceTypesCombo