export interface IDateFilter {
  from: Date;
  to: Date;
  currentOffset: number;
}

export const newDataFilter : IDateFilter ={
  to: (new Date().addDays(1)).getEndDayDate(),
  from: (new Date().addDays(-30)).getStartDayDate(),
  currentOffset: 0
}