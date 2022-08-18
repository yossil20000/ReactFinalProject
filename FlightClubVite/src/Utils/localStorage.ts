export function  getFromLocalStorage<T>(key: string) : T | string {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || "" ) as T : "";

}

export function setLocalStorage<T>(key: string, item: T ) {
  localStorage.setItem(key,JSON.stringify(item));
}