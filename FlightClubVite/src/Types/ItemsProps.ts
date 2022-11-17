export enum CRUDActions {
  ADD = "ADD",
  DELETE = "DELETE",
  UPDATE = "UPDATE",
  SAVE = "SAVE",
  CANCEL = "CANCEL"
}
export type DeviceTabItemProps<T> = {
  item: React.RefObject<T> | null;
  action: CRUDActions; 
}