import {isHttps} from '../../vite.config';

export function getServerAddress () {
  if(true)
    return `https://${URLS.BACKEND_ADDRESS}`
  else
  return `http://${URLS.BACKEND_ADDRESS}`
} 

export  enum URLS{
    BACKEND_ADDRESS = "localhost:3002",
    BACKEND_URL = "https://localhost:3002",
    LOGIN = "api/login",
    CHANGE_PASSWORD = "api/change_password",
    RESET = 'api/reset_password',
    RESERVATION = 'api/reservation',
    RESERVATION_DELETE = 'api/reservation/delete',
    RESERVATION_CREATE = 'api/reservation/create',
    RESERVATION_UPDATE = 'api/reservation/update',
    MEMBERS = 'api/members',
    MEMBER_DETAIL = 'api/members/detail',
    MEMBERS_COMBO = 'api/members/combo',
    MEMBERS_STATUS = 'api/members/status',
    DEVICES = 'api/devices',
    DEVICES_COMBO = 'api/devices/combo',
    FLIGHT = 'api/flight',
    CLUB_NOTICE = 'api/club_notice',
    CLUB_NOTICE_UPDATE ='api/club_notice/update',
    CLUB_NOTICE_DELETE ='api/club_notice/delete',
    CLUB_NOTICE_CREATE ='api/club_notice/create',
    DEVICE_TYPES = 'api/deviceTypes',
    DEVICE_TYPES_DETAILES = 'api/deviceTypes',
    DEVICE_TYPES_DELETE = 'api/deviceTypes',
    DEVICE_TYPES_UPDATE = 'api/deviceTypes/update',
    DEVICE_TYPES_CREATE = 'api/deviceTypes/create',
    DEVICE_TYPES_STATUS = 'api/deviceTypes/status',
    DEVICE_DETAILES = 'api/devices',
    DEVICE_DELETE = 'api/devices/delete',
    DEVICE_UPDATE = 'api/devices/update',
    DEVICE_CREATE = 'api/devices/create',
    DEVICE_STATUS = 'api/devices/status',
    MEMBERSHIP_DETAILES = 'api/memberships',
    MEMBERSHIP_DELETE = 'api/memberships/delete',
    MEMBERSHIP_UPDATE = 'api/memberships/update',
    MEMBERSHIP_CREATE = 'api/memberships/create',
    MEMBERSHIP_COMBO = 'api/memberships/combo',
    IMAGE = '/api/images',
    IMAGE_UPDATE = "/api/images/update",
    IMAGE_DELETE = '/api/images/delete',
    IMAGE_CREATE = '/api/images/create'
    
}