export interface IDeviceCombo {
  _id:string;
  device_id: string;
}
export interface IMemberCombo{
  _id:string;
  member_id: string;
  family_name: string;
  first_name: string;
}
export interface IFlightReservationProps {
  devices: IDeviceCombo[] | [];
  members: IMemberCombo[] | [];
}
