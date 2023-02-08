
import { useEffect, useState } from 'react'
import { useFetchMembersComboQuery } from '../../features/Users/userSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IMemberCombo, IMemberComboFilter } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';

export  const membersToItemCombo = (input: IMemberCombo): InputComboItem => {
  return {  lable: `${input.family_name}/${input.member_id}`, _id: input._id ,description: "",key: input.member_type }
}

const filterCombo : IMemberComboFilter = {
  filter: {
    status: Status.Active
  }
  }
  
function MembersCombo(props : ComboProps) {
  const {onChanged,source,filter,selectedItem: initialSelected,title} = props;
  const { data, isError, isLoading, error } = useFetchMembersComboQuery(filter === undefined ? {} : filter);
  
  const [items,setItems] = useState<InputComboItem[]>([]);
  /* const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>(); */
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/Member`,undefined);
 

  useEffect(() => {
    console.log("MembersCombo/ data", data?.data)
    
    let items  =   data?.data.map((item: IMemberCombo) => membersToItemCombo(item));
    console.log("MembersCombo/ Item", items)
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
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items} title={title=== undefined ? "Members" : title} />
  )
}

export default MembersCombo