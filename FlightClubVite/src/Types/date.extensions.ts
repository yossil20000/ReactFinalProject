
export {}
const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short'});
const daysOfWeek = [
  'Sun', 'Mon', 'Tue', 'Wed', "Thu", "Fri", "Sat"
]
declare global {
   interface Date {
      addHours(hours: number, useThis?: boolean): Date;
      addDays(days: number, useThis?: boolean): Date;
      addMonths(days: number, useThis?: boolean): Date;
      addYears(days: number, useThis?: boolean): Date;
      isToday(): boolean;
      clone(): Date;
      isAnotherMonth(date: Date): boolean;
      isWeekend(): boolean;
      isSameDate(date: Date): boolean;
      getWeek() : number;
      isSameMonth(date : Date) : boolean;
      getDisplayDate() : string;
      getDisplayDateTime() : string;
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
      getMidDayDate() : Date;
      compareTime(date: Date): number;
      compareDate(date: Date) : number;
      getHoursDiff(date: Date) : number;
      getLocal24Hours() : string;
      getStartQuarterDate(year?: number ,quarter?: number): Date
      getEndQuarterDate(year?: number ,quarter?: number): Date
      getQuarter() : number
      getStartOfYear(): Date
      getEndOfYear(): Date
      isIntersec(from:Date,to:Date) : boolean
      dateWithoutTimezone() : string 
      getOffsetDate(offset: number) : Date
      getDayDiff(date: Date) : number
      getWeekDayDateDisplay() : string
      getPadDateDisplay() : string
   }
}

Date.prototype.getStartMonth = function() : Date{
   return this.getFirstDateOfMonth(this.getFullYear(),this.getMonth()) 
}
Date.prototype.getEndMonth = function() : Date{
   
   return this.getLastDateOfMonth(this.getFullYear(),this.getMonth())
}

Date.prototype.getStartOfYear = function() : Date{
   return new Date(this.getFullYear(),0,1,0,0)

}
Date.prototype.getEndOfYear = function() : Date{
   return new Date(this.getFullYear(),11,31,23,59)
}

Date.prototype.getQuarter = function() : number {
   return Math.floor(this.getMonth() / 3) + 1
}
Date.prototype.getStartQuarterDate = function(year?:number ,quarter?: number) : Date {
   if(quarter == undefined){
      quarter= (new Date()).getQuarter()
   }
   if(year === undefined){
      year = (new Date()).getFullYear()
   }
   let step = (quarter -1);
   return new Date(year,step * 3 ,1,0,0,0,0);
}
Date.prototype.getEndQuarterDate = function(year?:number ,quarter?: number) : Date {
   if(quarter == undefined){
      quarter= (new Date()).getQuarter()
   }
   if(year === undefined){
      year = (new Date()).getFullYear()
   }
   let step = (quarter -1);
   let month = (step * 3) + 3;
   let lastDay = new Date(year,month,0,23,59,59,999);
   console.log("QuarterDate",step,month,lastDay)
   return lastDay;
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
Date.prototype.compareDate = function (date: Date) : number {
   const deltaY = this.getFullYear() - date.getFullYear() 
   const deltaM = this.getMonth() - date.getMonth();
   const deltaD = this.getDate() - date.getDate();
   /* CustomLogger.log("compareDate/deltaY,deltaM,deltaD",this,date,deltaY,deltaM,deltaD) */
   if(deltaY > 0) return 1;
   else if(deltaY < 0) return -1
   
   if(deltaM > 0) return 1
   else if(deltaM < 0) return -1
   
   if(deltaD > 0) return 1
   else if(deltaD < 0) return -1
   return 0;

}  
Date.prototype.getStartDayDate = function() : Date {
 return new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0,0);
}
Date.prototype.getEndDayDate = function() : Date {
   return new Date(this.getFullYear(),this.getMonth(),this.getDate(),23,59,59);
  }
Date.prototype.getMidDayDate = function() : Date {
   return new Date(this.getFullYear(),this.getMonth(),this.getDate(),12,0,0);
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
   return new Date(year,month + 1,0,23,59,59);
}
Date.prototype.getFirstDateOfMonth = function(year: number,month:number) : Date {
   return new Date(year,month ,1,0,0,0,0);
}

Date.prototype.addHours = function (hours: number): Date {
   if (!hours) return this;
   let date = this;
   date.setHours(date.getHours() + hours);

   return date;
};

Date.prototype.addDays = function (days: number): Date {
   if (!days) return this;
   let date = this;
   date.setDate(date.getDate() + days);

   return date;
};
Date.prototype.addMonths = function (months: number): Date {
   if (!months) return this;
   let date = this;
   date.setMonth(date.getMonth() + months)

   return date;
};
Date.prototype.addYears = function (years: number): Date {
   if (!years) return this;
   let date = this;
   date.setDate(date.getFullYear() + years);

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
   return dateFormat.format(this)
}

Date.prototype.getDisplayDateTime = function () : string {
   return dateTimeFormat.format(this)
}

Date.prototype.isIntersec = function(from:Date,to:Date) : boolean {
   /* CustomLogger.info("isIntersec/this,from,to,this(from),this(to)",this,from,to,this.compareDate(from),this.compareDate(to)) */
   return this.compareDate(from) >= 0 && this.compareDate(to) <= 0
}

Date.prototype.dateWithoutTimezone = function () :string {
   const tzoffset = this.getTimezoneOffset() * 60000; //offset in milliseconds
   const withoutTimezone = new Date(this.valueOf() - tzoffset)
     .toISOString()
     .slice(0, -1);
   return withoutTimezone;
 };

 Date.prototype.getOffsetDate = function(offset: number) : Date {
  if(!offset){
   offset = this.getTimezoneOffset()
  }
  const thisTimezoneOffset = this.getTimezoneOffset()
  const totalOffset : number = (thisTimezoneOffset - offset) * 60000
  CustomLogger.info("getOffsetDate/offset,totalOffset",offset,totalOffset)
  return new Date(this.valueOf() + totalOffset) 
 }

 Date.prototype.getDayDiff = function(date: Date) : number {
  const diffTime = (this.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
 }
Date.prototype.getWeekDayDateDisplay = function() : string {
   return `${daysOfWeek[this.getDay()]} ${this.getDate().toString().padStart(2,"0")}/${(this.getMonth()+1).toString().padStart(2,"0")}/${this.getFullYear()} ${this.getHours().toString().padStart(2,"0")}:${this.getMinutes().toString().padStart(2,"0")}`
}
Date.prototype.getPadDateDisplay = function() : string {
   return `${this.getDate().toString().padStart(2,"0")}/${(this.getMonth()+1).toString().padStart(2,"0")}/${this.getFullYear()}`
}
/* 
 const date = new Date()
 console.log("date.extensions loaded", date.getFullYear(), date.getMonth(), date.getDate(), daysOfWeek[date.getDay()])
 console.log("date.extensions loaded getWeekDayDateDisplay", date.getWeekDayDateDisplay())
 */  