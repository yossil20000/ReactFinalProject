
import { useRef } from 'react';
import { Transaction_OT } from '../../Interfaces/API/IClub';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from './ControledCombo';

function Transaction_OTCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props 
  const items = useRef(new Enum2ComboItem(Transaction_OT).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("Transaction_OTCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Category`} />
  )
}

export default Transaction_OTCombo