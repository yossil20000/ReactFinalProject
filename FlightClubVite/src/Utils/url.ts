export function getUrlWithParams (url: string,params: {[key: string]: string}) : string  {
  let added: boolean = false;
  if(url.search("/[//]/") == -1)
  {
    added = true;
    url= `http://${url}`
  }
  const urlParams : URL = new URL(url);
  
  for(const k in params){
    urlParams.searchParams.append(k,params[k]);
    console.log("url/getUrlWithParams",urlParams.href)
  }
  if(added){
    return urlParams.href.replace("http://","");
  }
  return urlParams.href;
}

export function getUrlWithParamsArray (url: string,params: {[key: string]: string[]}) : string  {
  let added: boolean = false;
  console.log("url/getUrlWithParams",params)
  if(url.search("/[//]/") == -1)
  {
    added = true;
    url= `http://${url}`
  }
  const urlParams : URL = new URL(url);
  const keys = Object(params).keys;
  for(const k in params){
    const values = params[k]
    values.map((i) => (urlParams.searchParams.append(k,i)))
    
    
    console.log("url/getUrlWithParams",urlParams.href)
  }
  if(added){
    return urlParams.href.replace("http://","");
  }
  return urlParams.href;
}
export function getParamsFromUrl (url: string) : {[key: string]: string} {
  const splitUrl = url.split('?');
  if(splitUrl.length >2) return {}
  const parammeters = splitUrl.length == 2 ? splitUrl[1] : splitUrl[0];
  const params = new URLSearchParams(parammeters) 
  console.log("url/getParamsFromUrl", Object.fromEntries(params.entries()))

  return Object.fromEntries(params.entries());
}