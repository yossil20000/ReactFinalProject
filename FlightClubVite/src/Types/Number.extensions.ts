export {}
export enum ERange {
  UNKNOWN = "UNKNOWN",
  BELOW = "BASE_BELOW",
  IN_RANGE = "IN_RANGE",
  ABOVE = "BASE_ABOVE"

}
export type tRangeResult = {
  range: ERange;
  diff: number;
}
declare global {
  interface Number {
    setFix(fix: number) : Number | string;
    IsInRange(min: number, max: number) : tRangeResult;
  }
}

Number.prototype.setFix = function (fix: number) : Number | string{
 if(Number.isNaN(this)) return "";
 return Number(this.toFixed(fix))
} 

Number.prototype.IsInRange = function (min: number, max: number) : tRangeResult{
  if(Number.isNaN(this) || min === undefined || max === undefined || min > max) return { range: ERange.UNKNOWN, diff: 0 };
  if(Number(this) < min) return { range: ERange.BELOW, diff: Number(this) - min };
  if(Number(this) > max) return { range: ERange.ABOVE, diff: Number(this) - max };
  return { range: ERange.IN_RANGE, diff: Number(this) - min };
}