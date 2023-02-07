
import { useEffect, useState } from 'react'
import { useFetchTypesQuery } from '../../features/Account/accountApiSlice';
import { useFetchMembersComboQuery } from '../../features/Users/userSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IMemberCombo, IMemberComboFilter } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import { ITypes } from '../../Interfaces/API/ITypes';
import ControledCombo, { ComboProps, InputComboItem } from './ControledCombo';

const filterCombo : IMemberComboFilter = {
  filter: {
    status: Status.Active
  }
  }
  
function TypesCombo(props : ComboProps) {
  const {onChanged,source,filter,selectedItem: initialSelected,title} = props;
  const { data, isError, isLoading, error } = useFetchTypesQuery(title === undefined ? "" : title);
  
  const [items,setItems] = useState<InputComboItem[]>([]);
  /* const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>(); */
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/${title}`,undefined);
 
  const TypesToItemCombo = (key: string,value: string): InputComboItem => {
    return {  lable: value, _id: key ,description: `${key} for ${value}`}
  }
  
  useEffect(() => {
    console.log("TypesCombo/ data", data?.data)
    const key = data?.data.key
    if(key === undefined) return;
    let items  =   data?.data.values.map((value: string) => TypesToItemCombo(key,value));
    console.log("TypesCombo/ Item", items)
    if (items !== undefined)
      setItems(items);
  }, [data?.data])

  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    onChanged(item);
  }
  useEffect(()=> {
    if(selectedItem)
      onChanged(selectedItem)
  },[])
  useEffect(() => {
    setSelectedItem(initialSelected)
  },[initialSelected])
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items} title={title=== undefined ? "" : title} />
  )
}

export default TypesCombo