
import { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage';
import { DEVICE_MET } from '../../Interfaces/API/IDevice'
import ControledCombo, { ComboProps } from '../Buttons/ControledCombo';
import { InputComboItem } from '../Buttons/InputCombo'


const getInputItems= () => {
  const items : InputComboItem[] = Object.keys(DEVICE_MET).filter((v) => isNaN(Number(v))).
  map((name) => {
    return {
      _id: DEVICE_MET[name as keyof typeof DEVICE_MET].toString(),
      description: "",
      lable: name
    }
  })
  console.log("PriceMeterCombo/items",items)
  return items;
}
function PriceMeterCombo(props : ComboProps) {
  const {onChanged,source} = props
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/PriceMeter`, undefined);
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("PriceMeterCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={getInputItems()} title="Price Method" />
  )
}

export default PriceMeterCombo