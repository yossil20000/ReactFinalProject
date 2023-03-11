
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
      addMinutes(minutes: number): Date;
      getFirstDateOfWeek(): Date;
      getLastDateOfWeek(): Date;
      getStartMonth(): Date;
      getEndMonth(): Date;
      getLastDateOfMonth(year: number,month:number) : Date;
      getFirstDateOfMonth(year: number,month:number) : Date;
      getLocalTimeWithOffset(offset: number) : Date;
      getStartDayDate() : Date;
      getEndDayDate() : Date;
      compareTime(date: Date): number;
      getHoursDiff(date: Date) : number;
      getLocal24Hours() : string;
   }
}
Date.prototype.getLocal24Hours = function(isLong: boolean = false) : string {
   if(isLong)
      return this.toLocaleTimeString("en-US",{hour12: false})
   
   return `${(this.getHours().toString().padStart(2,"0"))}:${this.getMinutes().toString().padStart(2,"0")}`
   
}
Date.prototype.getHoursDiff = function (date: Date) : number {
   return this.getHours() - date.getHours()
}
Date.prototype.compareTime = function (date: Date) : number {
   const deltaH = this.getHours() - date.getHours() 
   if(deltaH > 0) return 1;
   else if(deltaH < 0) return -1
   const deltaM = this.getMinutes() - date.getMinutes();
   if(deltaM > 0) return 1
   else if(deltaM < 0) return -1
   return 0

} 
Date.prototype.getStartDayDate = function() : Date {
 return new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0,0);
}
Date.prototype.getEndDayDate = function() : Date {
   return new Date(this.getFullYear(),this.getMonth(),this.getDate(),23,59,59);
  }
Date.prototype.getLocalTimeWithOffset = function(offset: number) : Date {
   const correctionOffset = offset - this.getTimezoneOffset()
   return new Date(this.addMinutes(correctionOffset))
}
Date.prototype.getFirstDateOfWeek = function () : Date {
   return new Date(this.setDate(this.getDate() - this.getDay()))
}
Date.prototype.getLastDateOfWeek = function () : Date {
   return new Date(this.setDate(this.getDate() - this.getDay() + 6))
}
Date.prototype.getLastDateOfMonth = function(year: number,month:number) : Date {
   return new Date(year,month + 1,0);
}
Date.prototype.getFirstDateOfMonth = function(year: number,month:number) : Date {
   return new Date(year,month ,1);
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