import { useState } from 'react'
import { FuelUnits } from '../../Types/FuelUnits';
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'

interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}

function DeviceTypeFuelUnitCombo(props : ComboProps) {
  const {onChanged} = props
  const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>();
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
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem}  items={getInputItems()} title={`Fuel Units`} />
  )
}

export default DeviceTypeFuelUnitCombo