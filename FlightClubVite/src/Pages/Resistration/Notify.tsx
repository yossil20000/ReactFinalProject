import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material'
import React, { useCallback, useState } from 'react'
import CheckSelect from '../../Components/Buttons/CheckSelect'
import { LabelType } from '../../Components/Buttons/MultiOptionCombo'
import Item from '../../Components/Item'
import { INotify, NotifyOn } from '../../Interfaces/API/INotification'
import { SetProperty } from '../../Utils/setProperty'
export interface INotifyProps {
  notify: INotify
}
function Notify({ notify }: INotifyProps) {
  const [selectNotify, setSelectNotify] = useState<INotify>(notify);
  const labelsFromNotifyOn = useCallback((): LabelType[] => {
    const lables: LabelType[] = Object.keys(NotifyOn).filter((v) => isNaN(Number(v))).
      map((name, index) => {
        return {
          name: name,
          color: NotifyOn[name as keyof typeof NotifyOn].toString(),
          description: name,
          _id: ""
        }
      })
    return lables;
  }, [])
  const onNotifyOnChanged = useCallback((item: LabelType[], prop: string): void => {
    console.log("onNotifyOnChanged/item", item, prop);
    const newObj: INotify = SetProperty(selectNotify, prop, item.map((i) => i.name)) as INotify;
    setSelectNotify(newObj)
    console.log("onNotifyOnChanged/newObj", newObj);
  }, [selectNotify]);
  const getSelectedItems = useCallback((): LabelType[] => {

    if (selectNotify !== undefined && selectNotify && selectNotify.notifyWhen !== undefined) {
      const initial = selectNotify.notifyWhen.map((item) => {
        return item.toString();
      });
      const result = labelsFromNotifyOn().filter((item) => (initial.includes(item.name)))
      return result;

    }
    return [];
  }, [labelsFromNotifyOn, selectNotify?.notifyWhen])
  const handleBoolainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("DeviceTabItem/handleBoolainChange", event.target.name, event.target.checked)
    const newObj: INotify = SetProperty(selectNotify, event.target.name, event.target.checked) as INotify;

    setSelectNotify(newObj)
  };
  return (
    <Grid container columns={4}>

      <Grid item xs={4}>
        <Item>
          <TextField sx={{ width: "100%", margin: "auto" }}
            disabled
            id="event"
            label="Event"
            value={selectNotify.event}
          />
        </Item>
      </Grid>
      <Grid item xs={4} >
        <FormControlLabel control={<Checkbox onChange={handleBoolainChange} name={"enabled"} checked={selectNotify?.enabled === undefined ? false : selectNotify?.enabled} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Enabled" />
      </Grid>
      <Grid item xs={4}>
        <Item>
          <CheckSelect selectedItems={getSelectedItems()} items={labelsFromNotifyOn()} onSelected={onNotifyOnChanged} label={'Notify on'} property={"notifyWhen"} />
        </Item>

      </Grid>
      <Grid item xs={4}>
        <Item>
          <TextField sx={{ width: "100%", margin: "auto" }}
            disabled
            id="notifyBy"
            label="NotifyBy"
            value={selectNotify.notifyBy}
          />
        </Item>

      </Grid>
    </Grid>
  )
}

export default Notify