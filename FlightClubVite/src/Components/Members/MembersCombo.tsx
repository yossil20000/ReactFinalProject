
import { useEffect, useState } from 'react'
import { useFetchMembersComboQuery } from '../../features/Users/userSlice';
import IDevice from '../../Interfaces/API/IDevice'
import IMember from '../../Interfaces/API/IMember';
import { IMemberCombo } from '../../Interfaces/IFlightReservationProps';
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'
interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
function MembersCombo(props : ComboProps) {
  const {onChanged} = props;
  const { data, isError, isLoading, error } = useFetchMembersComboQuery();
  
  const [items,setItems] = useState<InputComboItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>();
  
  const devicesToItemCombo = (input: IMemberCombo): InputComboItem => {
    return {  lable: `${input.family_name} ${input.member_id}`, _id: input._id }
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
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem} items={items} /* handleComboChange={handleDeviceOnChange} */ title="Members" />
  )
}

export default MembersCombo