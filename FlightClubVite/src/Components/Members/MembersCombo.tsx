
import { useEffect, useState } from 'react'
import { useFetchMembersComboQuery } from '../../features/Users/userSlice';
import { IMemberCombo } from '../../Interfaces/IFlightReservationProps';
import ControledCombo, { ComboProps } from '../Buttons/ControledCombo';
import { InputComboItem } from '../Buttons/InputCombo'

function MembersCombo(props : ComboProps) {
  const {onChanged} = props;
  const { data, isError, isLoading, error } = useFetchMembersComboQuery();
  
  const [items,setItems] = useState<InputComboItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>();
  
  const devicesToItemCombo = (input: IMemberCombo): InputComboItem => {
    return {  lable: `${input.family_name} ${input.member_id}`, _id: input._id ,description: ""}
  }
  
  useEffect(() => {
    console.log("AddReservation/ data", data?.data)
    
    let items  =   data?.data.map((item) => devicesToItemCombo(item));
    console.log("AddReservation/ Item", items)
    if (items !== undefined)
      setItems(items);
  }, [data?.data])

  const onSelectedItem = (item : InputComboItem) => {
    onChanged(item);
   
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items} title="Members" />
  )
}

export default MembersCombo