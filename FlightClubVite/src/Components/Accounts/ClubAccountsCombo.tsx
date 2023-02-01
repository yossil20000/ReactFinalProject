import '../../Types/Array.extensions';
import { useEffect, useState } from 'react'
import { useClubAccountQuery, useFetchAccountsComboQuery } from '../../features/Account/accountApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IAccount, IAccountsCombo } from '../../Interfaces/API/IAccount';
import { IClubAccount } from '../../Interfaces/API/IClub';
import { IMemberCombo, IMemberComboFilter } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';

const filterCombo: IMemberComboFilter = {
  filter: {
    status: Status.Active
  }
}

function ClubAccountsCombo(props: ComboProps) {
  const { onChanged, source, filter } = props;
  const { data, isError, isLoading, error } = useFetchAccountsComboQuery();
  const { data: clubAccounts } = useClubAccountQuery();
  const [accounts, setAccounts] = useState<string[]>();
  const [bankaccounts, setbankAccounts] = useState<string[]>()

  const getDiff = () => {
   if(accounts !== undefined && bankaccounts !== undefined){
    let diff = accounts.diff(bankaccounts)
    console.log("ClubAccountsCombo/getDiff/diff",diff)
    diff = accounts.symetricDiff(bankaccounts);
    console.log("ClubAccountsCombo/getDiff/symertricDiff",diff)
    diff = accounts.intersec(bankaccounts);
    console.log("ClubAccountsCombo/getDiff/intersect",diff)
   }
  }
  getDiff()
  const [items, setItems] = useState<InputComboItem[]>([]);
  /* const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>(); */
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/Member`, undefined);

  const accountsToItemCombo = (input: IAccountsCombo): InputComboItem => {
    return { lable: `${input.account_id} ${input.member?.family_name} ${input.member?.member_id}`, _id: input._id, description: "" }
  }

  useEffect(() => {
    console.log("ClubAccountsCombo/ data", data?.data)

    let items = data?.data.map((item: IAccountsCombo) => accountsToItemCombo(item));
    console.log("ClubAccountsCombo/ Item", items)
    if (items !== undefined)
      setItems(items);
    const itemsAccount = items?.map((item) => item._id);
    if (itemsAccount !== undefined) { setAccounts(itemsAccount); console.log("ClubAccountsCombo/itemsAccount", itemsAccount) }
  }, [data?.data])

  useEffect(() => {

    console.log("ClubAccountsCombo/clubAccounts/data", clubAccounts?.data)

    let items = clubAccounts?.data.map((item: IClubAccount) => (item.accounts));
    if (items !== undefined && items?.length > 0) {
      const itemsClubAccount = items[0].map((item) => item._id);
      if (itemsClubAccount !== undefined) {
        setbankAccounts(itemsClubAccount)
        console.log("ClubAccountsCombo/clubAccounts/itemsClubAccount", itemsClubAccount)
      }

    }
    console.log("ClubAccountsCombo/clubAccounts/items", items)
  }, [clubAccounts?.data])

  const onSelectedItem = (item: InputComboItem) => {
    setSelectedItem(item);
    onChanged(item);
    console.log("ClubAccountsCombo/onSelectedItem", item)
  }
  useEffect(() => {
    if (selectedItem)
      onChanged(selectedItem)
  }, [])
  return (
    <ControledCombo onSelectedItem={onSelectedItem} selectedItem={selectedItem === undefined ? null : selectedItem} items={items} title="Account" />
  )
}

export default ClubAccountsCombo