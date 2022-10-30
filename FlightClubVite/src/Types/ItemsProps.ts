export enum CRUDActions {
  ADD,
  DELETE,
  UPDATE,
  SAVE,
  CANCEL
}
export type DeviceTabItemProps<T> = {
  item: React.RefObject<T> | null;
  action: CRUDActions; 
}