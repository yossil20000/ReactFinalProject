
import { useRef } from 'react';
import { TransactionCombo_Type } from '../../Interfaces/API/IClub';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from './ControledCombo';

function TransactionTypeCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props 
  const items = useRef(new Enum2ComboItem(TransactionCombo_Type).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("TransactionTypeCombo/ DeviceItem", item)
    onChanged(item)
  }
  let typeLabel = "Type";
   switch ((selectedItem.label as TransactionCombo_Type).toLocaleLowerCase()) {
    case TransactionCombo_Type.CREDIT.toLocaleLowerCase():
      typeLabel= "Club Outcome"
      break;
    case TransactionCombo_Type.DEBIT.toLocaleLowerCase():
      typeLabel= "Club Income"
      break; 
    default:
      'Type';
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={typeLabel} />
  )
}

export default TransactionTypeCombo