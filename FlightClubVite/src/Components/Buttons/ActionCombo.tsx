
import useLocalStorage from '../../hooks/useLocalStorage';
import { CRUDActions } from '../../Types/ItemsProps';
import { InputComboItem } from '../Buttons/InputCombo'
import ControledCombo, { ComboProps } from './ControledCombo';


const getInputItems= () => {
  const items : InputComboItem[] = Object.keys(CRUDActions).filter((v) => isNaN(Number(v))).
  map((name) => {
    return {
      _id: CRUDActions[name as keyof typeof CRUDActions].toString(),
      description: "",
      lable: name
    }
  })
  console.log("ActionCombo/items",items)
  return items;
}
function ActionCombo(props : ComboProps) {
  const {onChanged} = props
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>("admin_action_combo",undefined);
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("ActionCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem }  items={getInputItems()} /* handleComboChange={handleDeviceOnChange} */ title={`Action`} />
    
  )
}

export default ActionCombo