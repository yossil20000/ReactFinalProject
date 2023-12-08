import { URLS } from "../Enums/Routers";

export const isHttps : boolean = false;
export function getServerAddress () {
 const deploy: boolean = false;

  if(deploy)
  {
    return  URLS.BACKEND_ADDRESS_DEPLOY;
  }
  else{
    return URLS.BACKEND_URL;
  }
  if(false)
    return `https://${URLS.BACKEND_ADDRESS}`
  else
  return `http://${URLS.BACKEND_ADDRESS}`
} 
