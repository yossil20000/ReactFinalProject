
import { useEffect, useState } from 'react'
import { useFetchMembersComboQuery } from '../../features/Users/userSlice';
import useSessionStorage from '../../hooks/useLocalStorage';
import { IMemberCombo, IMemberComboFilter, MemberType } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem, newInputComboItem } from '../Buttons/ControledCombo';

export  const membersToItemCombo = (input: IMemberCombo): InputComboItem => {
  if(input.member_type == MemberType.Supplier)
    return {  lable: `${input.first_name}.${input.family_name}/${input.member_id}`, _id: input._id ,description: "",key: input.member_type }
  return {  lable: `${input.family_name}/${input.member_id}`, _id: input._id ,description: "",key: input.member_type }
}

const filterCombo : IMemberComboFilter = {
  filter: {
    status: Status.Active,
    _id: ""
  }
  }
  
function MembersCombo(props : ComboProps) {
  const {onChanged,source,filter,selectedItem: initialSelected,title} = props;
  const { data, isError, isLoading, error } = useFetchMembersComboQuery(filter === undefined ? {} : filter);
  
  const [items,setItems] = useState<InputComboItem[]>([]);
  /* const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>(); */
  const [selectedItem, setSelectedItem] = useSessionStorage<InputComboItem | undefined>(`_${source}/Member`,undefined);
 

  useEffect(() => {
    CustomLogger.info("MembersCombo/ data", data?.data)
    
    let items  =   data?.data.map((item: IMemberCombo) => membersToItemCombo(item));
    CustomLogger.info("MembersCombo/ Item", items)
    if (items !== undefined)
      setItems(items);
      onSelectedItem(newInputComboItem)
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