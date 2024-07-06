
import { useEffect, useState } from 'react'
import { useFetchTypesQuery } from '../../features/Account/accountApiSlice';
import { IMemberComboFilter } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { InputComboItem, newInputComboItem, SelectComboProps } from './ControledCombo';

const filterCombo: IMemberComboFilter = {
  filter: {
    status: Status.Active,
    _id: ""
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
    CustomLogger.log(`TypesCombo/useeffect/${title}/find`, selectedValue, items, selectedKey)
    if (items.length > 0) {
      const item = items.find((i) => i.lable === selectedValue);
      if (item !== undefined) {
        setSelectedItem(item)
        CustomLogger.info(`TypesCombo/useeffect/${title}/found`, item)
      }
      else {
        setSelectedItem(newInputComboItem)
      }
    }
  }, [selectedValue, items])

  useEffect(() => {
    CustomLogger.log(`TypesCombo/useeffect/${title}/data`, data?.data)
    const key = data?.data.key
    if (key === undefined) return;
    let items = data?.data.values.map((value: string) => TypesToItemCombo(key, value));
    CustomLogger.info("TypesCombo/ Item", items)
    if (items !== undefined)
      setItems(items);
  }, [data?.data, selectedKey])
  useEffect(() => {
    refetch()
    CustomLogger.info(`TypesCombo/useeffect/${title}/selectedKey`, selectedKey)
  }, [selectedKey])

  const onSelectedItem = (item: InputComboItem) => {
    setSelectedItem(item);
    onChanged(item);
  }

  return (
    <ControledCombo onSelectedItem={onSelectedItem} selectedItem={selectedItem === undefined ? null : selectedItem} items={items} title={title === undefined ? "" : title} />
  )
}

export default TypesCombo