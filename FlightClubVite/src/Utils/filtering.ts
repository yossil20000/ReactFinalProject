import "../Types/date.extensions.js"
import { IDateFilter } from "../Interfaces/IDateFilter";
import { OrderStatus } from "../Interfaces/API/IAccount.js";

export function getTodayFilter(): IDateFilter {

  let filter: IDateFilter = {
    from: new Date().getStartDayDate(),
    to: (new Date()).getEndDayDate(),
    currentOffset: 0
  };
  CustomLogger.info("getTodayFilter", filter)
  return filter;
}
export function getDayFilter(today: Date): IDateFilter {

  let filter: IDateFilter = {
    from: today.getStartDayDate(),
    to: today.getEndDayDate(),
    currentOffset: 0
  };
  CustomLogger.info("getTodayFilter", filter)
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
  orderStatus?: OrderStatus
}
export function from_to_Filter(today: Date): any {
  return {
    to: (today.addDays(1)).getEndDayDate(),
    from: (today.addDays(-30)).getStartDayDate(),
  }
};
export function Current_Quarter_Filter(): any {
  const today = new Date();
  let filter = {
    to: today.getEndQuarterDate(today.getFullYear(),today.getQuarter()),
    from: today.getStartQuarterDate(today.getFullYear(),today.getQuarter()),
  }
  console.log("Current_Quarter_Filter/filter",filter)
  return filter;
};


