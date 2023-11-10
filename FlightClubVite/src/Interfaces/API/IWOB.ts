export enum WOBItemType {
  WOB_AIRCRAFT = "WOB_AIRCRAFT",
  WOB_CHAIR = "WOB_CHAIR",
  WOB_FUEL =  "WOB_FUEL"
}
export type WOBItem = {
  type: WOBItemType; 
  weight: number;
  cX: number;
  cY: number;
  limit?: number;
} 
export type WOBAircraft = {
  empty: WOBAircraft;
}
export type WOBLimits ={
  weight: number;
  fuel: number;
}
export interface IWOB {
  items: WOBItem[];
  aircrafy: WOBAircraft;

}