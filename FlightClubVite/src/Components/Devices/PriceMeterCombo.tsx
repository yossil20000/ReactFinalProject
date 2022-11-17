
import { useRef } from 'react';
import { DEVICE_MET } from '../../Interfaces/API/IDevice'
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from '../Buttons/ControledCombo';

function PriceMeterCombo(props : StateComboProps) {
  const {onChanged,source,selectedItem} = props
  const items = useRef(new Enum2ComboItem(DEVICE_MET).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={items.current} title="Price Method" />
  )
}

export default PriceMeterCombo