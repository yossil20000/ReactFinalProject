import { IAccount } from "./IAccount";

export interface IClubBase {
  account: IAccount,
  club_accounts: IAccount[],
}