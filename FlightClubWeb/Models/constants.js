const ROLES = {
    0: 'guest',
    1: 'user',
    2: 'desk',
    3: 'account',
    4: 'admin'
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
module.exports.ROLES = ROLES;
module.exports.DEVICE_STATUS = DEVICE_STATUS;
module.exports.DEVICE_MT = DEVICE_MT;
module.exports.DEVICE_MET = DEVICE_MET;
module.exports.DEVICE_INS = DEVICE_INS;