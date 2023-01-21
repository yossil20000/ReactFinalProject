import { useEffect, useState,useId } from 'react'
import { useFetchDevicsComboQuery } from '../../features/Device/deviceApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IDeviceCombo, IDeviceComboFilter } from '../../Interfaces/API/IDevice'
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';
const filterCombo : IDeviceComboFilter = {
filter: {
  status: Status.Active
}
}
function DevicesCombo(props : ComboProps) {
  const {onChanged,source,filter} = props
  const { data, isError, isLoading, error } = useFetchDevicsComboQuery(filter !== undefined ? filterCombo : {});
  
  const [devicesItems,setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useLocalStorage<InputComboItem | undefined>(`_${source}/Device`,undefined);
  function getDeviceDetailed(_id: string | undefined) : string {
    console.log("getDeviceDetailed", _id)
    if(_id === undefined)
      return "";
     const device : IDeviceCombo | undefined = data?.data?.find((i) => i._id == _id);
     if(device)
     {
      console.log("getDeviceDetailed/device",device)
      return `engien_meter: ${device.engien_meter} next_meter: ${device.maintanance.next_meter}`
     }
      
     return "";
  }
  const devicesToItemCombo = (input: IDeviceCombo): InputComboItem => {
    
    return {  lable: input.device_id, _id: input._id,description: getDeviceDetailed(input._id) }
  }
  console.log("DevicesCombo/selectedDevice" , selectedDevice)
  useEffect(() => {
    console.log("DevicesCombo/ Devices.data", data?.data)
    
    let items  =   data?.data.map((item) => {
      console.log("DevicesCombo/ DeviceItemMap", item)
      return devicesToItemCombo(item)
    });
    console.log("DevicesCombo/ DeviceItem", items)
    if (items !== undefined)
      setDevicesItem(items);
    if(isError){
        console.log("DevicesCombo/error", error)
    }
  }, [data?.data,isError])
  useEffect(()=> {
    if(selectedDevice)
      onChanged(selectedDevice)
  },[])
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedDevice(item);
    console.log("DevicesCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedDevice === undefined ? null : selectedDevice}  items={devicesItems} /* handleComboChange={handleDeviceOnChange} */ title="Devices" />
  )
}

export default DevicesCombo