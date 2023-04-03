
import {useRef } from 'react'
import { MemberType} from '../../Interfaces/API/IMember';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, {  InputComboItem, StateComboProps } from './ControledCombo';

function MemberTypeCombo(props : StateComboProps) {
const {onChanged,source, selectedItem} = props
  const items = useRef(new Enum2ComboItem(MemberType).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("MemberTypeCombo/DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Member Type`} />
  )
}
export default MemberTypeCombo