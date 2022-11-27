export interface IStatus {
  _id: string
  status: Status
}

export enum Status {
  "Active" = "Active","Suspended" = "Suspended","Removed"="Removed"
}