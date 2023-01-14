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

export function getParamsFromUrl (url: string) : {[key: string]: string} {
  const splitUrl = url.split('?');
  if(splitUrl.length >2) return {}
  const parammeters = splitUrl.length == 2 ? splitUrl[1] : splitUrl[0];
  const params = new URLSearchParams(parammeters) 
  console.log("url/getParamsFromUrl", Object.fromEntries(params.entries()))

  return Object.fromEntries(params.entries());
}