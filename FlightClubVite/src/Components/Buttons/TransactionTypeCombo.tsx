
import { useRef } from 'react';
import { Transaction_Type } from '../../Interfaces/API/IClub';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from './ControledCombo';

function TransactionTypeCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props 
  const items = useRef(new Enum2ComboItem(Transaction_Type).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("TransactionTypeCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Type`} />
  )
}

export default TransactionTypeCombo