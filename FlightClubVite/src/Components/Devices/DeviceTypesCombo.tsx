import { iteratorSymbol } from 'immer/dist/internal';
import { useEffect, useState, useId } from 'react'
import { useFetchAllDeviceTypesQuery } from '../../features/DeviceTypes/deviceTypesApiSlice';
import useSessionStorage from '../../hooks/useLocalStorage';
import IDeviceType from '../../Interfaces/API/IDeviceType';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';

export const deviceTypeToItemCombo = (input: IDeviceType): InputComboItem => {
  CustomLogger.log("DeviceTypesCombo/deviceTypeToItemCombo", input)
  return { label: input?.name, _id: input?._id, description: input?.name } as InputComboItem
}

function DeviceTypesCombo(props: ComboProps) {
  const { onChanged, source, selectedItem } = props
  const { data, isError, isLoading, error } = useFetchAllDeviceTypesQuery();

  const [devicesItems, setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<InputComboItem | undefined>(undefined);

  useEffect(() => {
    const found = devicesItems.find((item) => item._id === selectedItem?._id)
    if (found !== undefined)
      setSelectedDevice(found)
    else
    setSelectedDevice(selectedItem)
  }, [selectedItem])
  CustomLogger.log("DeviceTypesCombo/selectedDevice", selectedDevice)
  useEffect(() => {
    CustomLogger.info("DeviceTypesCombo/ Devices.data", data?.data)

    let items = data?.data.map((item: IDeviceType) => deviceTypeToItemCombo(item));
    CustomLogger.info("DeviceTypesCombo/useEffect", items)
    if (items !== undefined) {
      setDevicesItem(items);
    }
    if (isError) {
      CustomLogger.error("DeviceTypesCombo/error", error)
    }
  }, [data?.data, isError])

  const onSelectedItem = (item: InputComboItem) => {
    setSelectedDevice(item);
    CustomLogger.log("DeviceTypesCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem} selectedItem={selectedDevice === undefined ? null : selectedDevice} items={devicesItems} /* handleComboChange={handleDeviceOnChange} */ title="Device Types" />
  )
}

export default DeviceTypesCombo