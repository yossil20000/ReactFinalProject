import { useContext, useMemo, useState } from "react";
import { DevicesContext, DevicesContextType } from "../../app/Context/DevicesContext";
import MultiOptionCombo, { LabelType } from "../Buttons/MultiOptionCombo"
import { blue } from "@mui/material/colors";
import IDevice from "../../Interfaces/API/IDevice";
import { SetProperty } from "../../Utils/setProperty";
import { useAppDispatch } from "../../app/hooks";
import { setDirty } from "../../features/Admin/adminPageSlice";
import { useFetchMembersComboQuery } from "../../features/Users/userSlice";

export interface IMembersOptionComboProps {

}
const source: string = "MembersOptionCombo"
function MembersOptionCombo(props: IMembersOptionComboProps ) {
  const [selectedItem,setSelectedItem] = useState<IDevice | null | undefined>()
  const setDirtyDispatch = useAppDispatch()
  const { data: membersCombo } = useFetchMembersComboQuery({});
  //const { setSelectedItem, selectedItem, membersCombo } = useContext(DevicesContext) as DevicesContextType;
  const memberCanReserve = useMemo((): (LabelType[]) => {
    const labels: (LabelType[] | undefined) = membersCombo?.data?.map((item) => ({ _id: item._id, name: `${item.family_name} ${item.member_id}`, description: "", color: blue[700] }));
    CustomLogger.info("memberCanReserve/labels", labels)
    if (labels === undefined || labels === null)
      return []
    return labels;
  }, [membersCombo?.data])

  const getSelectedCanreserve = (): LabelType[] => {

    CustomLogger.log("MembersOptionCombo/getSelectedCanreserve/CanReserve(); selected.canreserv", memberCanReserve, selectedItem?.can_reservs)
    if (selectedItem !== undefined && selectedItem && selectedItem.can_reservs !== undefined) {
      const initial = selectedItem?.can_reservs.map((item) => {
        if (typeof item === 'string')
          return item;
        return ''
      });
      CustomLogger.info("getSelectedCanreserve/CanReserve/initial", initial)
      const result = memberCanReserve.filter((item) => (initial.includes(item._id)))
      CustomLogger.info("MembersOptionCombo/getSelectedCanreserve/CanReserve/result", result)
      return result;

    }
    return [];
  }
  const SetDirtyFlage = () => {
    CustomLogger.info("SetDirtyFlage/dirtyFlag", source, true);
    setDirtyDispatch(setDirty({ key: source, value: true }))
  }
  const onSelecteCanReserv = (items: LabelType[], property: string) => {
    CustomLogger.log("onSelecteCanReserv/CanReserve/property", property);
    CustomLogger.log("onSelecteCanReserv/CanReserve/items", items);
    const newValues = items.map((item) => (
      item._id
    )) as string[];
    CustomLogger.info("onSelecteCanReserv/CanReserve/newValues", newValues);
    const newObj: IDevice = SetProperty(selectedItem, property, newValues) as IDevice;
    CustomLogger.info("onSelecteCanReserv/CanReserve/newObj", newObj);
    setSelectedItem(newObj)
    SetDirtyFlage();
  }
  return (
    <MultiOptionCombo property={"can_reservs"} label={"Order Permssion"} selectedItems={getSelectedCanreserve()} items={memberCanReserve} onSelected={onSelecteCanReserv} />
  )
}

export default MembersOptionCombo