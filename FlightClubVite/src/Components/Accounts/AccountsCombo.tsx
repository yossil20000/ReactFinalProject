
import { useEffect, useState } from 'react'
import { useFetchAccountsComboQuery } from '../../features/Account/accountApiSlice';
import useSessionStorage from '../../hooks/useLocalStorage';
import { IAccountsCombo } from '../../Interfaces/API/IAccount';
import { IMemberCombo, IMemberComboFilter, MemberType } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';


function AccountsCombo(props : ComboProps) {
  const {onChanged,source,filter} = props;
  const { data, isError, isLoading, error } = useFetchAccountsComboQuery();
  
  const [items,setItems] = useState<InputComboItem[]>([]);
  /* const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>(); */
  const [selectedItem, setSelectedItem] = useSessionStorage<InputComboItem | undefined>(`_${source}/Member`,undefined);
 
  const accountsToItemCombo = (input: IAccountsCombo): InputComboItem => {
    return {  label: `${input.account_id} ${input.member?.family_name} ${input.member?.member_id}`, _id: input._id ,description: ""}
  }
  
  useEffect(() => {
    CustomLogger.log("AccountsCombo/ data", data?.data)
    let filterAccount = filter;
    if(filterAccount === undefined)
    {
      filterAccount = (item:IAccountsCombo) => { return true}
    }
    let items  =   data?.data.filter(filterAccount).map((item: IAccountsCombo) => accountsToItemCombo(item));
    CustomLogger.info("AccountsCombo/ Item", items)
    if (items !== undefined)
      setItems(items);
  }, [data?.data,filter])

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