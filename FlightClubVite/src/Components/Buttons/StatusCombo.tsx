
import {useRef } from 'react'
import { Status} from '../../Interfaces/API/IMember';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, {  InputComboItem, StateComboProps } from './ControledCombo';

function StatusCombo(props : StateComboProps) {
const {onChanged,source, selectedItem} = props
  const items = useRef(new Enum2ComboItem(Status).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    console.log("StatusCombo/DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Status`} />
  )
}
export default StatusCombo