import useLocalStorage from '../../hooks/useLocalStorage';
import { FuelUnits } from '../../Types/FuelUnits';
import ControledCombo, { ComboProps } from '../Buttons/ControledCombo';
import { InputComboItem } from '../Buttons/InputCombo'

function DeviceFuelUnitCombo(props : ComboProps) {
  const {onChanged,source} = props
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/DeviceFuelUnit`,undefined);
  function getInputItems<T> (): InputComboItem[] {
    const items : InputComboItem[] = Object.keys(FuelUnits).filter((v) => isNaN(Number(v))).
    map((name) => {
      return {
        _id: FuelUnits[name as keyof typeof FuelUnits].toString(),
        description: "",
        lable: name
      }
    })
    console.log("DeviceFuelUnitCombo/items",items)
    return items;
  }
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceFuelUnitCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={getInputItems()} title={`Fuel Units`} />
  )
}

export default DeviceFuelUnitCombo