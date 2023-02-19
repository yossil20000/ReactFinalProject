
import { useRef } from 'react';
import { PaymentMethod } from '../../Interfaces/API/IClub';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from './ControledCombo';

function PaymentMethodCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props 
  const items = useRef(new Enum2ComboItem(PaymentMethod).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    console.log("PaymentMethodCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Pay Method`} />
  )
}

export default PaymentMethodCombo