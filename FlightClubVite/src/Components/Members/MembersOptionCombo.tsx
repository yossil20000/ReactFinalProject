/* eslint-disable jsx-control-statements/jsx-jcs-no-undef */
import { useMemo, useState } from "react";
import MultiOptionCombo, { LabelType } from "../Buttons/MultiOptionCombo"
import { blue } from "@mui/material/colors";
import IDevice from "../../Interfaces/API/IDevice";
import { SetProperty } from "../../Utils/setProperty";
import { useFetchMembersComboQuery } from "../../features/Users/userSlice";
import { MemberType, Status } from "../../Interfaces/API/IMember";

export interface IMembersOptionComboProps {
  OnSelectedChanged: (selected: LabelType[]) => void
}

function MembersOptionCombo({ OnSelectedChanged }: IMembersOptionComboProps) {
  const can_reservs_property: string = "can_reservs";
  const { data: membersCombo } = useFetchMembersComboQuery({});
  const [selectedItem, setSelectedItem] = useState<LabelType[]>([] as unknown as LabelType[]);
  const onSelecteCanReserv = (items: LabelType[], property: string) => {
    CustomLogger.log("onSelecteCanReserv/CanReserve/property", property);
    CustomLogger.log("onSelecteCanReserv/CanReserve/items", items);
    const newValues = items.map((item) => (
      item._id
    )) as string[];
    CustomLogger.info("onSelecteCanReserv/CanReserve/newValues", newValues);
    const newObj: IDevice = SetProperty(selectedItem, property, newValues) as IDevice;
    CustomLogger.info("onSelecteCanReserv/CanReserve/newObj", newObj);
    setSelectedItem(items)
    OnSelectedChanged(items)
  }
  
  const options = useMemo((): (LabelType[]) => {
    const labels: (LabelType[] | undefined) = membersCombo?.data?.filter((i) => i.member_type == MemberType.Member && (i.status == Status.Active || i.status == Status.Suspended) ).map((item) => ({ _id: item._id, name: `${item.family_name} ${item.member_id}`, description: "", color: blue[700] }));
    CustomLogger.info("options/labels", labels)

    if (labels === undefined || labels === null)
      return []

    onSelecteCanReserv(labels, can_reservs_property)
    return labels;
  }, [membersCombo?.data])

  return (
    <MultiOptionCombo  label={"Select Members"} values={selectedItem} options={options} onChange={onSelecteCanReserv} property={can_reservs_property} />
  )
}

export default MembersOptionCombo