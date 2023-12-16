import '../Types/date.extensions.ts';
export interface IDateFilter {
  from: Date;
  to: Date;
  currentOffset: number;
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

export interface IFilterItems {
  key: string;
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>
}