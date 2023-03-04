import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import CheckSelect from '../../Components/Buttons/CheckSelect'
import { LabelType } from '../../Components/Buttons/MultiOptionCombo'
import Item from '../../Components/Item'
import { INotify, NotifyOn } from '../../Interfaces/API/INotification'
import { SetProperty } from '../../Utils/setProperty'
export interface INotifyProps {
  notify: INotify 
 onChanged: (notify : INotify)  => void
}
function Notify({ notify ,onChanged}: INotifyProps) {
  /* const [selectNotify, setSelectNotify] = useState<INotify>(notify); */
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

  const handleBoolainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Notify/handleBoolainChange", event.target.name, event.target.checked)
    let newObj: INotify = SetProperty(notify, event.target.name, event.target.checked) as INotify;
    onChanged(newObj);
    console.log("Notify/handleBoolainChange/newObj", newObj)
    /* setSelectNotify(newObj) */
  };

  const onNotifyOnChanged = (item: LabelType[], prop: string): void => {
    console.log("Notify/onNotifyOnChanged/item", item, prop);
    let newObj: INotify = SetProperty(notify, prop, item.map((i) => i.name)) as INotify;
    /* setSelectNotify(newObj) */
    onChanged(newObj);
    console.log("Notify/onNotifyOnChanged/newObj", newObj);
  };

  const getSelectedItems = useCallback((): LabelType[] => {

    if (notify !== undefined && notify && notify.notifyWhen !== undefined) {
      const initial = notify.notifyWhen.map((item) => {
        return item.toString();
      });
      const result = labelsFromNotifyOn().filter((item) => (initial.includes(item.name)))
      return result;

    }
    return [];
  }, [labelsFromNotifyOn, notify?.notifyWhen])


  return (
    <Grid container columns={4} sx={{'&.MuiPaper-root':{height:"100%"}}} style={{height: 'inherit'}} alignContent={'space-between'}>

      <Grid item xs={4}>
        <Item>
          <TextField sx={{ width: "100%", margin: "auto" }}
            disabled
            id="event"
            label="Event"
            value={notify.event}
          />
        </Item>
      </Grid>
      <Grid item xs={4} >
        <FormControlLabel control={<Checkbox onChange={handleBoolainChange} name={"enabled"} checked={notify?.enabled === undefined ? false : notify?.enabled} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Enabled" />
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
            value={notify.notifyBy}
          />
        </Item>

      </Grid>
    </Grid>
  )
}

export default Notify