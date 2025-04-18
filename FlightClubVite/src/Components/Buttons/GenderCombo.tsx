
import { useRef } from 'react';
import { Gender } from '../../Interfaces/API/IMember';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from '../Buttons/ControledCombo';

function GenderCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props 
  const items = useRef(new Enum2ComboItem(Gender).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    // eslint-disable-next-line jsx-control-statements/jsx-jcs-no-undef
    CustomLogger.log("GenderCombo/item", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Gender`} />
  )
}

export default GenderCombo