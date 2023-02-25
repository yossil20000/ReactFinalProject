import "../Types/date.extensions.js"
import { IDateFilter } from "../Interfaces/IDateFilter";

export function getTodayFilter(): IDateFilter {

  let filter: IDateFilter = {
    from: new Date(),
    to: (new Date()).addDays(1),
    currentOffset: 0
  };
  console.log("getTodayFilter", filter)
  return filter;
}

export function getWeekFilter(today: Date): IDateFilter {
  let filter: IDateFilter = {
    from: today.getFirstDateOfWeek(),
    to: today.getLastDateOfWeek().addDays(1),
    currentOffset: 0
  };
  return filter;
}
export function getMonthFilter(today: Date): IDateFilter {
  let filter: IDateFilter = {
    from: today.getFirstDateOfMonth(today.getFullYear(), today.getMonth()),
    to: today.getLastDateOfMonth(today.getFullYear(), today.getMonth()),
    currentOffset: 0
  };
  return filter;
}

export interface IOrderTableFilter {
  member?: string;
  from?: Date;
  to?: Date;
}
export function from_to_Filter(today: Date): any {
  return {
    to: (today.addDays(1)).getEndDayDate(),
    from: (today.addDays(-30)).getStartDayDate(),
  }
};


