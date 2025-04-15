

import { useRef } from 'react';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from './ControledCombo';
import { ESizePerUnit } from '../../Interfaces/API/IExpense';

function SizePerUnitCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props 
  const items = useRef(new Enum2ComboItem(ESizePerUnit).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("SizePerUnit", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Size Per Unit`} />
  )
}

export default SizePerUnitCombo