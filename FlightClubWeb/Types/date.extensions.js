

const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short'});

Date.prototype.getStartOfYear = function() {
   return this.getFirstDateOfMonth(this.getFullYear(),0)

}
Date.prototype.getEndOfYear = function() {
   return this.getLastDateOfMonth(this.getFullYear(),11)
}

Date.prototype.getQuarter = function()  {
   return Math.floor(this.getMonth() / 3) + 1
}
Date.prototype.getStartQuarterDate = function(year ,quarter)  {
   if(quarter == undefined){
      quarter= (new Date()).getQuarter()
   }
   if(year === undefined){
      year = (new Date()).getFullYear()
   }
   let step = (quarter -1);
   return new Date(year,step * 3 ,1,0,0,0,0);
}
Date.prototype.getEndQuarterDate = function(year ,quarter)  {
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

Date.prototype.getLocal24Hours = function(isLong)  {
   if(isLong)
      return this.toLocaleTimeString("en-US",{hour12: false})
   
   return `${(this.getHours().toString().padStart(2,"0"))}:${this.getMinutes().toString().padStart(2,"0")}`
   
}
Date.prototype.getHoursDiff = function (date)  {
   return this.getHours() - date.getHours()
}
Date.prototype.compareTime = function (date)  {
   const deltaH = this.getHours() - date.getHours() 
   if(deltaH > 0) return 1;
   else if(deltaH < 0) return -1
   const deltaM = this.getMinutes() - date.getMinutes();
   if(deltaM > 0) return 1
   else if(deltaM < 0) return -1
   return 0
}
Date.prototype.compareDate = function (date)  {
   const deltaY = this.getFullYear() - date.getFullYear() 
   if(deltaY > 0) return 1;
   else if(deltaY < 0) return -1
   const deltaM = this.getMonth() - date.getMonth();
   if(deltaM > 0) return 1
   else if(deltaM < 0) return -1
   const deltaD = this.getDay() - date.getDay();
   if(deltaD > 0) return 1
   else if(deltaD < 0) return -1
   return 0;

}  
Date.prototype.getStartDayDate = function()  {
 return new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0,0);
}
Date.prototype.getEndDayDate = function()  {
   return new Date(this.getFullYear(),this.getMonth(),this.getDate(),23,59,59);
  }
Date.prototype.getLocalTimeWithOffset = function(offset)  {
   const correctionOffset = offset - this.getTimezoneOffset()
   return new Date(this.addMinutes(correctionOffset))
}
Date.prototype.getFirstDateOfWeek = function ()  {
   return new Date(this.setDate(this.getDate() - this.getDay()))
}
Date.prototype.getLastDateOfWeek = function ()  {
   return new Date(this.setDate(this.getDate() - this.getDay() + 6))
}
Date.prototype.getLastDateOfMonth = function(year,month)  {
   return new Date(year,month + 1,0);
}
Date.prototype.getFirstDateOfMonth = function(year,month) {
   return new Date(year,month ,1);
}

Date.prototype.addDays = function (days) {
   if (!days) return this;
   let date = this;
   date.setDate(date.getDate() + days);

   return date;
};
Date.prototype.addMinutes = function (minutes) {
   if (!minutes) return this;
   let date = this;
   date.setMinutes(date.getMinutes() + minutes);

   return date;
};
Date.prototype.isToday = function (){
   let today = new Date();
   return this.isSameDate(today);
};

Date.prototype.clone = function (){
   return new Date(+this);
};

Date.prototype.isAnotherMonth = function (date) {
   return date && this.getMonth() !== date.getMonth();
};

Date.prototype.isWeekend = function ()  {
   return this.getDay() === 0 || this.getDay() === 6;
};

Date.prototype.isSameDate = function (date)  {
   return date && this.getFullYear() === date.getFullYear() && this.getMonth() === date.getMonth() && this.getDate() === date.getDate();
};

Date.prototype.getWeek = function ()  {
  
  const oneJan = new Date(this.getFullYear(),0,1);
  let a ;
  a = (this.valueOf() - oneJan.valueOf()) ;
  var numberOfDays = Math.floor((a) / (24 * 60 * 60 * 1000));
  var result = Math.ceil(( this.getDay() + 1 + numberOfDays) / 7);
  return result;
}
Date.prototype.isSameMonth = function (date)  {
  return date && this.getFullYear() === date.getFullYear() && this.getMonth() === date.getMonth();
};

Date.prototype.getDisplayDate = function ()  {
   return dateFormat.format(this)
}

Date.prototype.getDisplayDateTime = function ()  {
   return dateTimeFormat.format(this)
}

Date.prototype.getFSDate = function () {
   return `${this.getFullYear()}_${this.getMonth()}_${this.getDay()}_${this.getHours()}_${this.getMinutes()}_${this.getSeconds()}`
}

Date.prototype.getStartOfYear = function() {
   return this.getFirstDateOfMonth(this.getFullYear(),0)
}
Date.prototype.getEndOfYear = function() {
   return this.getLastDateOfMonth(this.getFullYear(),11)
}

Date.prototype.getQuarter = function() {
   return Math.floor(this.getMonth() / 3) + 1
}
Date.prototype.getStartQuarterDate = function(year ,quarter) {
   if(quarter == undefined){
      quarter= (new Date()).getQuarter()
   }
   if(year === undefined){
      year = (new Date()).getFullYear()
   }
   let step = (quarter -1);
   return new Date(year,step * 3 ,1,0,0,0,0);
}
Date.prototype.getEndQuarterDate = function(year ,quarter) {
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
Date.prototype.isIntersec = function(from,to)  {
   /* CustomLogger.info("isIntersec/this,from,to,this(from),this(to)",this,from,to,this.compareDate(from),this.compareDate(to)) */
   return this.compareDate(from) >= 0 && this.compareDate(to) <= 0
}

Date.prototype.dateWithoutTimezone = function ()  {
   const tzoffset = this.getTimezoneOffset() * 60000; //offset in milliseconds
   const withoutTimezone = new Date(this.valueOf() - tzoffset)
     .toISOString()
     .slice(0, -1);
   return withoutTimezone;
 };

 Date.prototype.toGMT = function() {
   return new Date(this.toLocaleString('en', {timeZone: 'GMT'}))
 }
 Date.prototype.getOffsetDate = function(offset)  {
   if(!offset){
    offset = this.getTimezoneOffset()
   }
   const totalOffset  = (this.getTimezoneOffset() - offset) * 60000
   console.log("getOffsetDate/offset,totalOffset",offset,totalOffset)
   return new Date(this.valueOf() + totalOffset) 
  }

  Date.prototype.TimeOffsetDate = function(time ,offset)  {
   
   console.log("TimeOffsetDate/time,offset",time,offset)
   return new Date(this.valueOf() + offset * 60000);
  }