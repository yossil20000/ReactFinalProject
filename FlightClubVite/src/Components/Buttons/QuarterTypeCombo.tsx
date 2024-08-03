
import { useRef } from 'react';
import { Enum2ComboItem, QuarterType } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from './ControledCombo';

function QuarterTypeCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props 
  const items = useRef(new Enum2ComboItem(QuarterType).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("QuarterTypeCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Category`} />
  )
}

export default QuarterTypeCombo