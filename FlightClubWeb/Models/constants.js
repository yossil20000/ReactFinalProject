const ROLES = {
    0: 'supplier',
    1: 'guest',
    2: 'user',
    3: 'desk',
    4: 'account',
    5: 'admin'
}
const DEVICE_STATUS = {
    0:"IN_SERVICE",
    1:"OUT_OFSERVICE",
    2:"MAINTANANCE",
    3:"NOT_EXIST"}
const DEVICE_MT={
    0:"50hr", 1:"100hr",2:"Annual"
}
const DEVICE_MET = {
    HOBBS:'HOBBS',ENGIEN:'ENGIEN'
}
const DEVICE_INS = {
    VFR:"VFR",IFR:"IFR",G1000:"G1000",ICE:"ICE",AIR_CONDITION:"AIR_CONDITION"
}
const STATUS = {
    "Active": "Active",
    "Suspended":"Suspended",
    "Removed":"Removed" 
}

const OrderStatus = {
    "CREATED": "Created",
    "CLOSE" : "Close"
}
const ERROR_TYPE = {
    DB : "DB",
    DB_RESULT: "DB_RESULT",
    EXCEPTION: "EXCEPTION",
}
module.exports.ERROR_TYPE = ERROR_TYPE;
module.exports.ROLES = ROLES;
module.exports.DEVICE_STATUS = DEVICE_STATUS;
module.exports.DEVICE_MT = DEVICE_MT;
module.exports.DEVICE_MET = DEVICE_MET;
module.exports.DEVICE_INS = DEVICE_INS;
module.exports.STATUS = STATUS;
module.exports.OrderStatus = OrderStatus;