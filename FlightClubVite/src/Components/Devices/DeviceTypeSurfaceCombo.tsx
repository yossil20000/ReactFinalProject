
import { useRef } from 'react'
import { SurfaceType } from '../../Interfaces/API/IDeviceType';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from '../Buttons/ControledCombo';

function DeviceTypeSurfaceCombo(props : StateComboProps) {
  const {onChanged,source, selectedItem} = props
  const items = useRef(new Enum2ComboItem(SurfaceType).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    CustomLogger.log("DeviceTypeSurfaceCombo/DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Surface Type`} />
  )
}
export default DeviceTypeSurfaceCombo