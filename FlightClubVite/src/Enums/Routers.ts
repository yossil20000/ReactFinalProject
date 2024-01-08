export const isHttps : boolean = true;
export function getServerAddress () {
 const deploy: boolean = true;

  if(deploy)
  {
    return  BACKEND.BACKEND_ADDRESS_DEPLOY;
  }
  else{
    return BACKEND.BACKEND_URL;
  }
  if(false)
    return `https://${BACKEND.BACKEND_ADDRESS}`
  else
  return `http://${BACKEND.BACKEND_ADDRESS}`
} 
export enum BACKEND {
  BACKEND_ADDRESS = "localhost:3002",
  BACKEND_URL = "http://localhost:3002",
  BACKEND_URL_DEPLOY = "https://bazhaifaapi.onrender.com",
  BACKEND_ADDRESS_DEPLOY = "https://bazhaifaapi.onrender.com",
}
