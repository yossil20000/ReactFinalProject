
import { useEffect, useState } from 'react'
import { useFetchAccountsComboQuery } from '../../features/Account/accountApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IAccountsCombo } from '../../Interfaces/API/IAccount';
import { IMemberCombo, IMemberComboFilter } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';

const filterCombo : IMemberComboFilter = {
  filter: {
    status: Status.Active
  }
  }
  
function AccountsCombo(props : ComboProps) {
  const {onChanged,source,filter} = props;
  const { data, isError, isLoading, error } = useFetchAccountsComboQuery();
  
  const [items,setItems] = useState<InputComboItem[]>([]);
  /* const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>(); */
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/Member`,undefined);
 
  const accountsToItemCombo = (input: IAccountsCombo): InputComboItem => {
    return {  lable: `${input.account_id} ${input.member?.family_name} ${input.member?.member_id}`, _id: input._id ,description: ""}
  }
  
  useEffect(() => {
    CustomLogger.log("AccountsCombo/ data", data?.data)
    
    let items  =   data?.data.map((item: IAccountsCombo) => accountsToItemCombo(item));
    CustomLogger.info("AccountsCombo/ Item", items)
    if (items !== undefined)
      setItems(items);
  }, [data?.data])

  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    onChanged(item);
    CustomLogger.info("AccountsCombo/onSelectedItem", item)
  }
  useEffect(()=> {
    if(selectedItem)
      onChanged(selectedItem)
  },[])
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items} title="Account" />
  )
}

export default AccountsCombo