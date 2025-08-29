import { isHttps } from "../Enums/Routers";

let httpPefix = "https://"
export function getUrlWithParams (url: string,params: {[key: string]: string}) : string  {
  let added: boolean = false;
 
  if(isHttps == false)
    httpPefix ="http://"
  if(url.search("/[//]/") == -1)
  {
    added = true;
    url= `${httpPefix}${url}`
  }
  const urlParams : URL = new URL(url);
  
  for(const k in params){
    urlParams.searchParams.append(k,params[k]);
    CustomLogger.info("url/getUrlWithParams",urlParams.href)
  }
  if(added){
    return urlParams.href.replace(httpPefix,"");
  }
  return urlParams.href;
}
export interface IParams {
  key: string, value: any
}
export function getUrlWithParamsArray (url: string,params:IParams[]) : string  {
  let added: boolean = false;
  console.info("url/getUrlWithParams",params)
  if(url.search("/[//]/") == -1)
  {
    added = true;
    url= `${httpPefix}${url}`
  }
  const urlParams : URL = new URL(url);
  params.map((i) => (urlParams.searchParams.append(i.key,i.value)))
  console.info("url/getUrlWithParams/href",urlParams.href)
  if(added){
    return urlParams.href.replace(httpPefix,"");
  }
  console.info("url/getUrlWithParams/href",urlParams.href)
  return urlParams.href;
}
export function getParamsFromUrl (url: string) : {[key: string]: string} {
  const splitUrl = url.split('?');
  if(splitUrl.length >2) return {}
  const parammeters = splitUrl.length == 2 ? splitUrl[1] : splitUrl[0];
  const params = new URLSearchParams(parammeters) 
  CustomLogger.info("url/getParamsFromUrl", Object.fromEntries(params.entries()))
  return Object.fromEntries(params.entries());
}