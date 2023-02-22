export {}

declare global {
  interface Number {
    setFix(fix: number) : Number | string;
  }
}

Number.prototype.setFix = function (fix: number) : Number | string{
 if(Number.isNaN(this)) return "";
 return Number(this.toFixed(fix))
} 