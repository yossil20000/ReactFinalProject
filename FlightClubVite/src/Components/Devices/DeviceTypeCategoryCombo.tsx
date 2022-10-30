import { useState } from 'react'
import { CategoryType } from '../../Interfaces/API/IDeviceType';
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'

interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}

function DeviceFuelUnitCombo(props : ComboProps) {
  const {onChanged} = props
  const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>();
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
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem}  items={getInputItems()} title={`Category`} />
  )
}

export default DeviceFuelUnitCombo