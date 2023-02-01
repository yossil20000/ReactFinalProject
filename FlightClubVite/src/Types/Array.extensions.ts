export {}
declare global {
  interface Array<T> {
    diff(array: Array<T>) : Array<T>;
    symetricDiff(array: Array<T>) : Array<T>;
    intersec(array: Array<T>) : Array<T>
  }
}

Array.prototype.diff =  function(arr2)
{
   return this.filter(x => !arr2.includes(x)); 
}
Array.prototype.intersec =  function(arr2)
{
   return this.filter(x => arr2.includes(x)); 
}
Array.prototype.symetricDiff =  function(arr2)
{
   return this.filter(x => !arr2.includes(x))
   .concat(arr2.filter(x => this.includes(x))); 
}
