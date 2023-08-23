export type IndexType<T> = {
  [key:string]: T;
}
export type IndexItem<T> = {
  key: string,
  value: T
}
export function hasKey<O>(obj: Object,key: PropertyKey) : key is keyof O {
  return key in obj
}
/* in is used when we're defining an index signature that we want 
to type with a union of string, number or symbol literals. 
In combination with keyof we can use it to create a so called mapped type, 
which re-maps all properties of the original type. */
type Optional<T> = { 
  [K in keyof T]?: T[K] 
};

/* K can therefore only be a public property name of T. */
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}