import "../Types/date.extensions.js"
import { IDateFilter } from "../Interfaces/IDateFilter";
import { OrderStatus } from "../Interfaces/API/IAccount.js";
import { FlightStatus } from "../Interfaces/API/IFlight.js";


export function getTodayFilter(): IDateFilter {

  let filter: IDateFilter = {
    from: new Date().getStartDayDate(),
    to: (new Date()).getEndDayDate(),
    currentOffset: (new Date()).getTimezoneOffset()
  };
  CustomLogger.info("getTodayFilter", filter)
  return filter;
}
export function getDayFilter(today: Date): IDateFilter {

  let filter: IDateFilter = {
    from: today.getStartDayDate(),
    to: today.getEndDayDate(),
    currentOffset: (new Date()).getTimezoneOffset()
  };
  CustomLogger.info("getTodayFilter", filter)
  return filter;
}
export function getWeekFilter(today: Date): IDateFilter {
  let filter: IDateFilter = {
    from: today.getFirstDateOfWeek(),
    to: today.getLastDateOfWeek().addDays(1),
    currentOffset: (new Date()).getTimezoneOffset()
  };
  return filter;
}
export function getMonthFilter(today: Date): IDateFilter {
  let filter: IDateFilter = {
    from: today.getFirstDateOfMonth(today.getFullYear(), today.getMonth()),
    to: today.getLastDateOfMonth(today.getFullYear(), today.getMonth()),
    currentOffset: (new Date()).getTimezoneOffset()
  };
  return filter;
}

export interface IOrderTableFilter {
  member?: string;
  from?: Date;
  to?: Date;
  orderStatus?: OrderStatus
}
export interface IUserAccountFilter {
  member?: string;
  from?: Date;
  to?: Date;
}
export interface IAccountFlightFilter {
  status: FlightStatus,
  from: Date,
  to: Date
}
export interface IAccountsFilter {
  supplier: boolean;
  members: boolean;
  club: boolean;
}

export function accountsFilter(): IAccountsFilter {
  let filter : IAccountsFilter = {
    supplier: true,
    members: true,
    club: false
  }
  return filter
}
export function getAccountFlightFilter(): IAccountFlightFilter {
  const today = new Date()
  return {
    from: today.getStartOfYear(),
    to: today.getEndOfYear(),
    status: FlightStatus.CREATED
  }
}
export function from_to_Filter(today: Date): IDateFilter {
  return {
    to: (today.addDays(1)).getEndDayDate(),
    from: (today.addDays(-30)).getStartDayDate(),
    currentOffset: (new Date()).getTimezoneOffset()
  }
};

export function from_to_year_Filter(today: Date): IDateFilter {
  return {
    to: today.getEndOfYear(),
    from: today.getStartOfYear().addMonths(-3),
    currentOffset: (new Date()).getTimezoneOffset()
  }
};



export function Current_Quarter_Filter(): any {
  const today = new Date();
  let filter = {
    to: today.getEndQuarterDate(today.getFullYear(), today.getQuarter()),
    from: today.getStartQuarterDate(today.getFullYear(), today.getQuarter()),
  }
  console.log("Current_Quarter_Filter/filter", filter)
  return filter;
};


