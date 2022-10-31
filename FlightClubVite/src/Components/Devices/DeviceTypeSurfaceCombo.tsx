
import { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage';
import { SurfaceType } from '../../Interfaces/API/IDeviceType';
import ControledCombo, { ComboProps } from '../Buttons/ControledCombo';
import { InputComboItem } from '../Buttons/InputCombo'


const getInputItems= () => {
  const items : InputComboItem[] = Object.keys(SurfaceType).filter((v) => isNaN(Number(v))).
  map((name) => {
    return {
      _id: SurfaceType[name as keyof typeof SurfaceType].toString(),
      description: "",
      lable: name
    }
  })
  console.log("DeviceTypeSurfaceCombo/items",items)
  return items;
}
function DeviceTypeSurfaceCombo(props : ComboProps) {
  const {onChanged} = props
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>("admin_surface_type",undefined);
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceTypeSurfaceCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={getInputItems()} /* handleComboChange={handleDeviceOnChange} */ title={`Surface Type`} />
  )
}

export default DeviceTypeSurfaceCombo