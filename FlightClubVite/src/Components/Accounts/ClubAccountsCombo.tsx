import '../../Types/Array.extensions';
import { useEffect, useState } from 'react'
import { useClubAccountComboQuery, useClubAccountQuery } from '../../features/Account/accountApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IClubAccountCombo, IClubAccountsCombo } from '../../Interfaces/API/IClub';
import { IMemberComboFilter, MemberType } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, IClubAccountProps, InputComboItem } from '../Buttons/ControledCombo';

const filterCombo: IMemberComboFilter = {
  filter: {
    status: Status.Active
  }
}


function ClubAccountsCombo(props: IClubAccountProps) {
  const { onChanged, source, filter, title, selectedItem: initialItem ,includesType} = props;
  const { data: accounts } = useClubAccountComboQuery();
  const [bankaccounts, setbankAccounts] = useState<InputComboItem[]>([])
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`${source}`, undefined);

  const accountToItemCombo = (input: IClubAccountCombo): InputComboItem => {
    if(input.member.member_type == MemberType.Supplier)
      return { lable: `${input.member.member_id}/${input.member.family_name}/${input.account_id}`, _id: input._id, description: "", key: input.member.member_type, key2: input.account_id }
    return { lable: `${input.member.member_id}/${input.member.family_name}/${input.account_id}`, _id: input._id, description: "", key: input.member.member_type, key2: input.account_id }
  }

  useEffect(() => {
    CustomLogger.log("ClubAccountsCombo/accounts/data", accounts?.data)
    let items = accounts?.data.map((item: IClubAccountsCombo) => (item));
    if (items !== undefined && items?.length > 0) {
      const club = items.at(0);
      const clubInput: InputComboItem = { lable: `${club?.club.brand}/${club?.club.branch}/${club?.club.account_id}`, _id: club?._id === undefined ? "" : club?._id, description: "", key: MemberType.Club, key2: club?.club.account_id }
      const foudItems = club?.accounts.map((item) => 
        accountToItemCombo(item));
      const itemsClubAccount: InputComboItem[] = foudItems === undefined ? [] : foudItems;

      if (clubInput !== undefined) {
        CustomLogger.log("ClubAccountsCombo/accounts/findClub", includesType,clubInput)
        if (includesType?.findIndex((i) => i == MemberType.Club) >= 0) 
        {
          CustomLogger.log("ClubAccountsCombo/accounts/findClub_push", includesType,clubInput)
          itemsClubAccount.push(clubInput);
          setbankAccounts([clubInput]);
        }
      }

      if (itemsClubAccount !== undefined && includesType?.findIndex((i) => i == MemberType.Member || i == MemberType.Supplier) >= 0) {
        setbankAccounts(itemsClubAccount);
        CustomLogger.info("ClubAccountsCombo/accounts/itemsClubAccount", itemsClubAccount)
      }
      
    }
    CustomLogger.info("ClubAccountsCombo/clubAccounts/items", items)
  }, [accounts?.data])

  const onSelectedItem = (item: InputComboItem) => {
    setSelectedItem(item);
    onChanged(item);
    CustomLogger.info("ClubAccountsCombo/onSelectedItem", item)
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