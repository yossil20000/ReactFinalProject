
import { useRef } from 'react';
import { PaymentMethod } from '../../Interfaces/API/IClub';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from './ControledCombo';

function PaymentMethodCombo(props : StateComboProps) {
  const {onChanged,selectedItem,disable=true} = props 
  const items = useRef(new Enum2ComboItem(PaymentMethod).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("PaymentMethodCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo disable={disable} onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Pay Method`} />
  )
}

export default PaymentMethodCombo