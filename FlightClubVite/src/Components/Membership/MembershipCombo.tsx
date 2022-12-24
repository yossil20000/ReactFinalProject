
import { useEffect, useState } from 'react'
import { useFetchAllMembershipQuery } from '../../features/membership/membershipApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IMembership from '../../Interfaces/API/IMembership';

import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';

function MembershipCombo(props : ComboProps) {
  const {onChanged,source,filter} = props;
  const { data, isError, isLoading, error } = useFetchAllMembershipQuery();
  
  const [items,setItems] = useState<InputComboItem[]>([]);
  /* const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>(); */
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/Member`,undefined);
 
  const devicesToItemCombo = (input: IMembership): InputComboItem => {
    return {  lable: `${input.name} (${input.rank})`, _id: input._id ,description: ""}
  }
  
  useEffect(() => {
    console.log("MembershipCombo/ data", data?.data)
    
    let items  =   data?.data.map((item) => devicesToItemCombo(item));
    console.log("MembershipCombo/ Item", items)
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
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items} title="Rank" />
  )
}

export default MembershipCombo