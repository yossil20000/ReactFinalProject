
import { useRef } from 'react';
import { OrderStatus } from '../../Interfaces/API/IAccount';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from '../Buttons/ControledCombo';

function OrderStatusCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props 
  const items = useRef(new Enum2ComboItem(OrderStatus).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("OrderStatusCombo/item", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`OrderStatus`} />
  )
}

export default OrderStatusCombo