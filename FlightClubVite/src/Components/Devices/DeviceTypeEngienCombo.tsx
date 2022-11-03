
import { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage';
import { EngienType } from '../../Interfaces/API/IDeviceType';
import ControledCombo, { ComboProps } from '../Buttons/ControledCombo';
import { InputComboItem } from '../Buttons/InputCombo'


const getInputItems= () => {
  const items : InputComboItem[] = Object.keys(EngienType).filter((v) => isNaN(Number(v))).
  map((name) => {
    return {
      _id: EngienType[name as keyof typeof EngienType].toString(),
      description: "",
      lable: name
    }
  })
  console.log("DeviceTypeEngienCombo/items",items)
  return items;
}
function DeviceTypeEngienCombo(props : ComboProps) {
  const {onChanged,source} = props
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/DeviceTypeEngien`,undefined);
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceTypeEngienCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={getInputItems()} /* handleComboChange={handleDeviceOnChange} */ title={`Engien Type`} />
  )
}

export default DeviceTypeEngienCombo