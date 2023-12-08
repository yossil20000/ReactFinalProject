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
    "CREATED": "CREATED",
    "CLOSE" : "CLOSE"
}
const OrderTypeReferance = {
    "Flight": "Flight",
    "Expense" : "Expense",
    "Montly": "Montly",
    "Other": "Other",
    "Transfer": "Transfer"
}
const ERROR_TYPE = {
    DB : "DB",
    DB_RESULT: "DB_RESULT",
    EXCEPTION: "EXCEPTION",
}
const  EAccountType = {
    BANK: "100100",
    MEMBER: '200200',
    SUPPLIERS: '200300'
  }
  const  MemberType ={
    CLUB: "Club",
    MEMBER: "Member",
    SUPPLIERS: "Supplier"    
}

const NotifyOn = {
    CREATED: "CREATED",
    CHANGED: "CHANGED",
    DELETED: "DELETED"
}
const NotifyBy = {
    EMAIL: "EMAIL"
}
const TransactionType = {
    CREDIT: "CREDIT",
  DEBIT: "DEBIT",
  TRANSFER: "TRANSFER"
}
const PaymentMethod ={
    VISA: "VISA",
    CHECK: "CHECK",
    TRANSFER: "TRANSFER",
    NONE: "NONE"
}
const Utilizated = {
  HOURS_0000: "HOURS_0000",
  HOURS_0100: "HOURS_0100",
  HOURS_0200: "HOURS_0200",
  HOURS_0500: "HOURS_0500",
  HOURS_1000: "HOURS_1000",
  HOURS_1500: "HOURS_1500",
  HOURS_2000: "HOURS_2000"
}
const NotifyEvent = {
    "ClubNotice": "ClubNotice",
    "FlightReservation": "FlightReservation"
}
module.exports.NotifyEvent = NotifyEvent;
module.exports.TransactionType = TransactionType;
module.exports.Utilizated = Utilizated;
module.exports.PaymentMethod = PaymentMethod;
module.exports.NotifyBy = NotifyBy;
module.exports.ERROR_TYPE = ERROR_TYPE;
module.exports.ROLES = ROLES;
module.exports.DEVICE_STATUS = DEVICE_STATUS;
module.exports.DEVICE_MT = DEVICE_MT;
module.exports.DEVICE_MET = DEVICE_MET;
module.exports.DEVICE_INS = DEVICE_INS;
module.exports.STATUS = STATUS;
module.exports.OrderStatus = OrderStatus;
module.exports.EAccountType = EAccountType;
module.exports.MemberType = MemberType;
module.exports.NotifyOn = NotifyOn;
module.exports.OrderTypeReferance = OrderTypeReferance;