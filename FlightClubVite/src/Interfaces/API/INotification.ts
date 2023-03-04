

export enum NotifyEvent {
  "ClubNotice" = "ClubNotice",
  "FlightReservation" = "FlightReservation"
}

export enum NotifyBy {
  EMAIL = "EMAIL"
}
export enum NotifyOn {
  CREATED = "CREATED",
  CHANGED = "CHANGED",
  DELETED = "DELETED"
}
export interface INotify {
  event: NotifyEvent,
  enabled: boolean,
  notifyWhen: NotifyOn[],
  notifyBy: NotifyBy[]
}
export interface INotificationBase {
  member: {
    _id: string,
    fullName: string,
    email: string,
    phone: string
  },
  enabled: boolean,
  notify: INotify[],
  
}

export interface INotification extends INotificationBase {
 _id: string
}

export const newNotification : INotification = {
  _id: "",
  member: {
    _id: "",
    fullName: "",
    email: "",
    phone: ""
  },
  enabled: false,
  notify: []
}
export let newNotify : INotify = {
  event: NotifyEvent.ClubNotice,
  enabled: false,
  notifyWhen: [NotifyOn.CHANGED,NotifyOn.CREATED,NotifyOn.DELETED],
  notifyBy: [NotifyBy.EMAIL]
}
export function getNewNotify(event: NotifyEvent) : INotify {
  const notify = {...newNotify}
  notify.event = event;
  return notify;
}
export function getNewNotification (memberId : string = "") : INotification  {
  const notification : INotification = {
    _id: "",
    member: {
      _id: memberId,
      fullName: "",
      email: "",
      phone: ""
    },
    enabled: false,
    notify: []
  }
  notification.notify.push(getNewNotify(NotifyEvent.ClubNotice))
  notification.notify.push(getNewNotify(NotifyEvent.FlightReservation))
  
  return notification;
}