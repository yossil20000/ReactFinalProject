
import useLocalStorage from '../../hooks/useLocalStorage';
import { CRUDActions } from '../../Types/ItemsProps';
import ControledCombo, { ComboProps, InputComboItem } from './ControledCombo';

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
  const {onChanged,source} = props
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/Action`,undefined);
  
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