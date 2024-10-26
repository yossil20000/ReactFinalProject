import '../Types/date.extensions.ts';
import { EQuarterOption } from '../Utils/enums.js';
export interface IDateFilter {
  from: Date;
  to: Date;
  currentOffset: number;
}
export interface IQuarterFilter {
  quarter: EQuarterOption;
  year: number;
}

export interface IQuarterDateFilter extends IDateFilter {
  quarterFilter: IQuarterFilter
}
export const newDateFilter : IDateFilter ={
  to: (new Date().addDays(30)).getEndDayDate(),
  from: (new Date().addDays(-1)).getStartDayDate(),
  currentOffset: 0
}
export const fullYearFilter: IDateFilter = {
  from: (new Date()).getStartOfYear(),
  to: (new Date()).getEndOfYear(),
  currentOffset: 0
}
export const fullMonthFilter: IDateFilter = {
  from: (new Date()).getStartMonth(),
  to: (new Date()).getEndMonth(),
  currentOffset: 0
}
export const newQuarterDateFilter: IQuarterDateFilter = {
  from: (new Date()).getStartOfYear(),
  to: (new Date()).getEndOfYear(),
  currentOffset: 0,
  quarterFilter: {
    quarter: EQuarterOption.E_QO_Q0,
    year: new Date().getFullYear()
  }
}
export interface IFilterItems {
  key: string;
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>
}