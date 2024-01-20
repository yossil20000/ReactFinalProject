/* ts-node c:\Users\Yossil\Documents\Repos\ReactFinalProject\FlightClubVite\test.ts */
interface IParams {
  key: string, value: any
}
const data: IParams[]= [
  { key: "Key_1", value: "Value_1" },
  { key: "Key_2", value: "Value_2" }
]
let httpPefix = "https://"
function getUrlWithParamsArray (url: string,params:IParams[]) : string  {
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
getUrlWithParamsArray("url", data);