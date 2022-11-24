
import { useEffect, useState } from 'react'
import { useFetchMembersComboQuery } from '../../features/Users/userSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IMemberCombo } from '../../Interfaces/API/IMember';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';


function MembersCombo(props : ComboProps) {
  const {onChanged,source} = props;
  const { data, isError, isLoading, error } = useFetchMembersComboQuery();
  
  const [items,setItems] = useState<InputComboItem[]>([]);
  /* const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>(); */
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/Member`,undefined);
 
  const devicesToItemCombo = (input: IMemberCombo): InputComboItem => {
    return {  lable: `${input.family_name} ${input.member_id}`, _id: input._id ,description: ""}
  }
  
  useEffect(() => {
    console.log("MembersCombo/ data", data?.data)
    
    let items  =   data?.data.map((item: IMemberCombo) => devicesToItemCombo(item));
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
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items} title="Members" />
  )
}

export default MembersCombo