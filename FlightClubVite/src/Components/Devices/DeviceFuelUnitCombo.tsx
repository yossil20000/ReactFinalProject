import { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage';
import { FuelUnits } from '../../Types/FuelUnits';
import ControledCombo, { ComboProps } from '../Buttons/ControledCombo';
import { InputComboItem } from '../Buttons/InputCombo'



function DeviceTypeFuelUnitCombo(props : ComboProps) {
  const {onChanged} = props
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>("admin_fuel_units",undefined);
  function getInputItems<T> (): InputComboItem[] {
    const items : InputComboItem[] = Object.keys(FuelUnits).filter((v) => isNaN(Number(v))).
    map((name) => {
      return {
        _id: FuelUnits[name as keyof typeof FuelUnits].toString(),
        description: "",
        lable: name
      }
    })
    console.log("DeviceTypeFuelUnitCombo/items",items)
    return items;
  }
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceTypeFuelUnitCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={getInputItems()} title={`Fuel Units`} />
  )
}

export default DeviceTypeFuelUnitCombo