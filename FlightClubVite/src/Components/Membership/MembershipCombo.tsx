
import { useEffect, useMemo, useState } from 'react'
import { useFetchAllMembershipQuery } from '../../features/membership/membershipApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IMembership from '../../Interfaces/API/IMembership';

import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';

function MembershipCombo(props : ComboProps) {
  const {onChanged,source,filter,selectedItem:initeialMemberShip} = props;
  const { data, isError, isLoading, error } = useFetchAllMembershipQuery();
  
  const [items,setItems] = useState<InputComboItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InputComboItem>(initeialMemberShip === undefined ? {_id: "",lable:"",description:""} : initeialMemberShip); 
 /*  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/Member`,undefined);
  */
  const MemberShipToItemCombo = (input: IMembership): InputComboItem => {
    return {  lable: `${input.name}`, _id: input._id ,description: ""}
  }
  
  useEffect(() => {
    console.log("MembershipCombo/ data", data?.data)
    
    let items  =   data?.data.map((item) => MemberShipToItemCombo(item));
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
    {

      onChanged(selectedItem)
    }
  },[])
  const getSelected : InputComboItem = useMemo(() => {
    let itemFound = items?.find((i) => i._id == initeialMemberShip?._id)
    console.log("MembershipCombo/getSelected", initeialMemberShip,  itemFound)
    
    itemFound =  itemFound === undefined ? {_id:"",lable:"",description:""} : itemFound
    setSelectedItem(itemFound)
    return itemFound;
  },[initeialMemberShip])
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem} items={items} title="Rank" />
  )
}

export default MembershipCombo