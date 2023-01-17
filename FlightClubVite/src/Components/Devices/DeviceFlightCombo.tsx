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
export interface IDeviceFlightComboProps {
  onChanged: (item: InputComboItem,has_hobbs: boolean) => void;
  source: string;
  selectedItem?: InputComboItem;
  filter?: any;
}
function DevicesFlightCombo(props : IDeviceFlightComboProps) {
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
      console.log("getDeviceDetailed/dvice",device)
      return `engien_meter: ${device.engien_meter} next_meter: ${device.maintanance.next_meter}`
     }
      
     return "";
  }
  const devicesToItemCombo = (input: IDeviceCombo): InputComboItem => {
    
    return {  lable: input.device_id, _id: input._id,description: getDeviceDetailed(input._id) }
  }
  console.log("DevicesFlightCombo/selectedDevice" , selectedDevice)
  useEffect(() => {
    console.log("DevicesFlightCombo/ Devices.data", data?.data)
    
    let items  =   data?.data.map((item) => {
      console.log("DevicesFlightCombo/ DeviceItemMap", item)
      return devicesToItemCombo(item)
    });
    console.log("DevicesFlightCombo/ DeviceItem", items)
    if (items !== undefined)
      setDevicesItem(items);
    if(isError){
        console.log("DevicesFlightCombo/error", error)
    }
  }, [data?.data,isError])
  useEffect(()=> {
    if(selectedDevice){
      const hasHobbs = data?.data.find((device) => selectedDevice._id === device._id)?.has_hobbs;
      onChanged(selectedDevice,hasHobbs === undefined ? false : hasHobbs)
    }
      
  },[])
  const onSelectedItem = (item : InputComboItem) => {
    const hasHobbs = data?.data.find((device) => item._id === device._id)?.has_hobbs;
    setSelectedDevice(item);
    console.log("DevicesFlightCombo/ DeviceItem", item)
    onChanged(item,hasHobbs === undefined ? false : hasHobbs)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedDevice === undefined ? null : selectedDevice}  items={devicesItems} /* handleComboChange={handleDeviceOnChange} */ title="Devices" />
  )
}

export default DevicesFlightCombo