import { useRef } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { CategoryType } from '../../Interfaces/API/IDeviceType';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { ComboProps, InputComboItem, StateComboProps } from '../Buttons/ControledCombo';


function DeviceTypeCategoryCombo(props : StateComboProps) {
  const {onChanged,source,selectedItem} = props
  const items = useRef(new Enum2ComboItem(CategoryType).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={items.current} title={`Category`} />
  )
}

export default DeviceTypeCategoryCombo