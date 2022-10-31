import { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage';
import { CategoryType } from '../../Interfaces/API/IDeviceType';
import ControledCombo, { ComboProps } from '../Buttons/ControledCombo';
import { InputComboItem } from '../Buttons/InputCombo'

function DeviceFuelUnitCombo(props : ComboProps) {
  const {onChanged} = props
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>("admin_category",undefined);
  function getInputItems<T> (): InputComboItem[] {
    const items : InputComboItem[] = Object.keys(CategoryType).filter((v) => isNaN(Number(v))).
    map((name) => {
      return {
        _id: CategoryType[name as keyof typeof CategoryType].toString(),
        description: "",
        lable: name
      }
    })
    console.log("DeviceFuelUnitCombo/items",items)
    return items;
  }
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceFuelUnitCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={getInputItems()} title={`Category`} />
  )
}

export default DeviceFuelUnitCombo