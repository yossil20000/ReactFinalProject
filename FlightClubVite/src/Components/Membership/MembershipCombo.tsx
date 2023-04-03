
import { useEffect, useMemo, useState } from 'react'
import { useFetchAllMembershipQuery } from '../../features/membership/membershipApiSlice';
import IMembership from '../../Interfaces/API/IMembership';

import ControledCombo, { InputComboItem } from '../Buttons/ControledCombo';
export interface MembershipCombo {
  onChanged: (item: IMembership) => void;
  source: string;
  selectedItem?: InputComboItem;
  filter?: any;
}
function MembershipCombo(props: MembershipCombo) {
  const { onChanged, source, filter, selectedItem: initeialMemberShip } = props;
  const { data, isError, isLoading, error } = useFetchAllMembershipQuery();

  const [items, setItems] = useState<InputComboItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InputComboItem>(initeialMemberShip === undefined ? { _id: "", lable: "", description: "" } : initeialMemberShip);
  /*  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>(`_${source}/Member`,undefined);
   */
  const MemberShipToItemCombo = (input: IMembership): InputComboItem => {
    return { lable: `${input.name}`, _id: input._id, description: "" }
  }

  useEffect(() => {
    CustomLogger.info("MembershipCombo/ data:initeialMemberShip", data?.data , initeialMemberShip)

    let items = data?.data.map((item) => MemberShipToItemCombo(item));
    CustomLogger.info("MembershipCombo/ Item", items)
    if (items !== undefined)
      setItems(items);
    setSelectedItem(initeialMemberShip === undefined ? { _id: "", lable: "", description: "" } : initeialMemberShip)
  }, [data?.data])

  const onSelectedItem = (item: InputComboItem) => {
    setSelectedItem(item);
    const found = findMembership(item)
    if (found !== undefined)
      onChanged(found);

  }
  useEffect(() => {
    if (selectedItem) {
      const found = findMembership(selectedItem)
      if (found !== undefined)
        onChanged(found);
    }
  }, [])
  const findMembership = (selectedItem: InputComboItem): IMembership | undefined => {
    const found = data?.data.find((item) => item._id === selectedItem._id)

    return found

  }
  const getSelected: InputComboItem = useMemo(() => {
    let itemFound = items?.find((i) => i._id == initeialMemberShip?._id)
    CustomLogger.info("MembershipCombo/getSelected", initeialMemberShip, itemFound)

    itemFound = itemFound === undefined ? { _id: "", lable: "", description: "" } : itemFound
    setSelectedItem(itemFound)
    return itemFound;
  }, [initeialMemberShip])
  return (
    <ControledCombo onSelectedItem={onSelectedItem} selectedItem={selectedItem} items={items} title="Rank" />
  )
}

export default MembershipCombo