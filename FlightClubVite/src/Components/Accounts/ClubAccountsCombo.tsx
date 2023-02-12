import '../../Types/Array.extensions';
import { useEffect, useState } from 'react'
import { useClubAccountComboQuery, useClubAccountQuery, useFetchAccountsComboQuery } from '../../features/Account/accountApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IAccount, IAccountsCombo } from '../../Interfaces/API/IAccount';
import { IClubAccount, IClubAccountCombo, IClubAccountsCombo } from '../../Interfaces/API/IClub';
import { IMemberCombo, IMemberComboFilter, MemberType } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';

const filterCombo: IMemberComboFilter = {
  filter: {
    status: Status.Active
  }
}

function ClubAccountsCombo(props: ComboProps) {
  const { onChanged, source, filter,title,selectedItem:initialItem } = props;
  const { data: clubAccounts } = useClubAccountQuery();
  const { data: accounts} = useClubAccountComboQuery();
  const [bankaccounts, setbankAccounts] = useState<InputComboItem[]>([])

/*   const getDiff = () => {
   if(accounts !== undefined && bankaccounts !== undefined){
    let diff = accounts.diff(bankaccounts)
    console.log("ClubAccountsCombo/getDiff/diff",diff)
    diff = accounts.symetricDiff(bankaccounts);
    console.log("ClubAccountsCombo/getDiff/symertricDiff",diff)
    diff = accounts.intersec(bankaccounts);
    console.log("ClubAccountsCombo/getDiff/intersect",diff)
   }
  } */
  /* getDiff() */
 
  /* const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>(); */
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`${source}`, undefined);


  const accountToItemCombo = (input: IClubAccountCombo): InputComboItem => {
    return { lable: `${input.member.family_name}/${input.member.member_id}/${input.account_id}`, _id: input._id, description: "" ,key: input.member.member_type, key2: input.account_id}
  }


/*   useEffect(() => {

    console.log("ClubAccountsCombo/clubAccounts/data", clubAccounts?.data)

    let items = clubAccounts?.data.map((item: IClubAccount) => (item));
    if (items !== undefined && items?.length > 0) {
      const itemsClubAccount : InputComboItem[] = items.map((item) => clubsAccountToItemCombo(item));
      if (itemsClubAccount !== undefined) {
        setbankAccounts(itemsClubAccount)
        console.log("ClubAccountsCombo/clubAccounts/itemsClubAccount", itemsClubAccount)
      }

    }
    console.log("ClubAccountsCombo/clubAccounts/items", items)
  }, [clubAccounts?.data]) */

  useEffect(() => {

    console.log("ClubAccountsCombo/accounts/data", accounts?.data)

     let items = accounts?.data.map((item: IClubAccountsCombo) => (item));
    if (items !== undefined && items?.length > 0) {
      const club = items.at(0);
      let clubAccount : InputComboItem[] = [];
      const clubInput : InputComboItem =  { lable: `${club?.club.brand}/${club?.club.branch}/${club?.club.account_id}`, _id: club?._id === undefined ? "" : club?._id , description: "" ,key: MemberType.Club , key2:club?.club.account_id}
      const foudItems = club?.accounts.map((item) => accountToItemCombo(item));
      const itemsClubAccount : InputComboItem[] = foudItems === undefined ? [] : foudItems;
      if(clubInput !== undefined){
        itemsClubAccount.push(clubInput);
      }
      
      if (itemsClubAccount !== undefined) {
        setbankAccounts(itemsClubAccount)
        console.log("ClubAccountsCombo/accounts/itemsClubAccount", itemsClubAccount)
      }

    } 
    console.log("ClubAccountsCombo/clubAccounts/items", items) 
  }, [accounts?.data])

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
    <ControledCombo onSelectedItem={onSelectedItem} selectedItem={selectedItem === undefined ? null : selectedItem} items={bankaccounts} title={title === undefined ? "Account" : title} />
  )
}

export default ClubAccountsCombo