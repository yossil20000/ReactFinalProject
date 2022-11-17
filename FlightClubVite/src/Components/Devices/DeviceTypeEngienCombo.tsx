
import { useRef } from 'react'
import { EngienType } from '../../Interfaces/API/IDeviceType';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, {  InputComboItem, StateComboProps } from '../Buttons/ControledCombo';


function DeviceTypeEngienCombo(props : StateComboProps) {
  const {onChanged,source,selectedItem} = props
  const items = useRef(new Enum2ComboItem(EngienType).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Engien Type`} />
  )
}

export default DeviceTypeEngienCombo