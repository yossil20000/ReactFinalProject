
import { useCallback, useRef } from 'react'
import { Status} from '../../Interfaces/API/IMember';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, {  InputComboItem, StateComboProps } from '../Buttons/ControledCombo';


function StatusCombo(props : StateComboProps) {
  const {onChanged,source,selectedItem} = props
  const items = useRef(new Enum2ComboItem(Status).getItems())
  const onSelectedItem = useCallback((item : InputComboItem) => {
    onChanged(item)
  },[])
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Status`} />
  )
}

export default StatusCombo