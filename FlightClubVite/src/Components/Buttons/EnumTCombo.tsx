
import { useRef } from 'react';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from './ControledCombo';

function EnumTCombo<T extends {[name: string]: any},Y extends StateComboProps , JSX>(qw : T,props: Y ) {
  const {onChanged,selectedItem} = props
  const items = useRef(new Enum2ComboItem<T>(qw).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("PaymentMethodCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Pay Method`} />
  )
}

export default EnumTCombo
