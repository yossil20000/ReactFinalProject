
import { useRef } from 'react';
import { Utilizated } from '../../Interfaces/API/IExpense';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from './ControledCombo';

function UtilizatedCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props 
  const items = useRef(new Enum2ComboItem(Utilizated).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("UtilizatedCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Utilizated`} />
  )
}

export default UtilizatedCombo