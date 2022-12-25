
export {}

declare global {
   interface Date {
      addDays(days: number, useThis?: boolean): Date;
      isToday(): boolean;
      clone(): Date;
      isAnotherMonth(date: Date): boolean;
      isWeekend(): boolean;
      isSameDate(date: Date): boolean;
      getWeek() : number;
      isSameMonth(date : Date) : boolean;
      getDisplayDate() : string;
      addMinutes(minutes: number): Date
   }
}

Date.prototype.addDays = function (days: number): Date {
   if (!days) return this;
   let date = this;
   date.setDate(date.getDate() + days);

   return date;
};
Date.prototype.addMinutes = function (minutes: number): Date {
   if (!minutes) return this;
   let date = this;
   date.setMinutes(date.getMinutes() + minutes);

   return date;
};
Date.prototype.isToday = function (): boolean{
   let today = new Date();
   return this.isSameDate(today);
};

Date.prototype.clone = function (): Date{
   return new Date(+this);
};

Date.prototype.isAnotherMonth = function (date: Date): boolean {
   return date && this.getMonth() !== date.getMonth();
};

Date.prototype.isWeekend = function (): boolean  {
   return this.getDay() === 0 || this.getDay() === 6;
};

Date.prototype.isSameDate = function (date: Date): boolean  {
   return date && this.getFullYear() === date.getFullYear() && this.getMonth() === date.getMonth() && this.getDate() === date.getDate();
};

Date.prototype.getWeek = function () : number  {
  
  const oneJan = new Date(this.getFullYear(),0,1);
  let a : number;
  a = (this.valueOf() - oneJan.valueOf()) as number;
  var numberOfDays = Math.floor((a) / (24 * 60 * 60 * 1000));
  var result = Math.ceil(( this.getDay() + 1 + numberOfDays) / 7);
  return result;
}
Date.prototype.isSameMonth = function (date: Date): boolean  {
  return date && this.getFullYear() === date.getFullYear() && this.getMonth() === date.getMonth();
};

Date.prototype.getDisplayDate = function () : string {
   return this.toDateString()
}