
import { useEffect, useState } from 'react'
import { useFetchTypesQuery } from '../../features/Account/accountApiSlice';
import { useFetchMembersComboQuery } from '../../features/Users/userSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IMemberCombo, IMemberComboFilter } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import { ITypes } from '../../Interfaces/API/ITypes';
import ControledCombo, { ComboProps, InputComboItem, newInputComboItem, SelectComboProps } from './ControledCombo';

const filterCombo: IMemberComboFilter = {
  filter: {
    status: Status.Active
  }
}

function TypesCombo(props: SelectComboProps) {
  const { onChanged, source, filter, selectedItem: initialSelected, title, selectedKey, selectedValue } = props;
  const { data, isError, isLoading, error, refetch } = useFetchTypesQuery(selectedKey === undefined ? "" : selectedKey);

  const [items, setItems] = useState<InputComboItem[]>([]);
  /* const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>(); */
  const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>();

  const TypesToItemCombo = (key: string, value: string): InputComboItem => {
    return { lable: value, _id: key, description: `${key} for ${value}` }
  }

  useEffect(() => {
    refetch()
    console.log(`TypesCombo/useeffect/${title}/find`, selectedValue,items,selectedKey)
    if (items.length > 0) {
      const item = items.find((i) => i.lable === selectedValue  );
      if (item !== undefined) {
        setSelectedItem(item)
        console.log(`TypesCombo/useeffect/${title}/found`, item)
      }
      else{
        setSelectedItem(newInputComboItem)
      }
    }
  }, [selectedValue, items])

  useEffect(() => {
    console.log(`TypesCombo/useeffect/${title}/data`, data?.data)
    const key = data?.data.key
    if (key === undefined) return;
    let items = data?.data.values.map((value: string) => TypesToItemCombo(key, value));
    console.log("TypesCombo/ Item", items)
    if (items !== undefined)
      setItems(items);
  }, [data?.data,selectedKey])
  useEffect(() => {
refetch()
console.log(`TypesCombo/useeffect/${title}/selectedKey`, selectedKey)
  },[selectedKey])

  const onSelectedItem = (item: InputComboItem) => {
    setSelectedItem(item);
    onChanged(item);
  }


  return (
    <ControledCombo onSelectedItem={onSelectedItem} selectedItem={selectedItem === undefined ? null : selectedItem} items={items} title={title === undefined ? "" : title} />
  )
}

export default TypesCombo