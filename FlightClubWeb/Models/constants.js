const ROLES = {
    0: 'supplier',
    1: 'guest',
    2: 'user',
    3: 'desk',
    4: 'account',
    5: 'admin'
}
const DEVICE_STATUS = {
    0: "IN_SERVICE",
    1: "OUT_OFSERVICE",
    2: "MAINTANANCE",
    3: "NOT_EXIST"
}
const DEVICE_MT = {
    0: "50hr", 1: "100hr", 2: "200hr"
}
const DEVICE_MET = {
    HOBBS: 'HOBBS', ENGIEN: 'ENGIEN'
}
const DEVICE_INS = {
    VFR: "VFR", IFR: "IFR", G1000: "G1000", ICE: "ICE", AIR_CONDITION: "AIR_CONDITION"
}
const STATUS = {
    "Active": "Active",
    "Suspended": "Suspended",
    "Removed": "Removed"
}

const OrderStatus = {
    "CREATED": "CREATED",
    "CLOSE": "CLOSE"
}
const OrderTypeReferance = {
    "Flight": "Flight",
    "Expense": "Expense",
    "Montly": "Montly",
    "Other": "Other",
    "Transfer": "Transfer",
    "Refund": "Refund",
    "Variable": "Variable"
}
const ERROR_TYPE = {
    DB: "DB",
    DB_RESULT: "DB_RESULT",
    EXCEPTION: "EXCEPTION",
}
const EAccountType = {
    BANK: "100100",
    MEMBER: '200200',
    SUPPLIERS: '200300'
}
const MemberType = {
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
const CalcType = {
    TRANSACTION: "TRANSACTION",
    AMOUNT: "AMOUNT"
}
const PaymentMethod = {
    VISA: "VISA",
    CHECK: "CHECK",
    TRANSFER: "TRANSFER",
    NONE: "NONE"
}
const QuarterType = {
    NONE: "NONE",
    Q1: "Q1",
    Q2: "Q2",
    Q3: "Q3",
    Q4: "Q4"
}
/**
 * Enumeration of flight hours utilization markers.
 * Represents different thresholds of flight hours for maintenance and tracking purposes.
 * @readonly
 * @enum {string}
 * @property {string} HOURS_0000 - 0 hours marker
 * @property {string} HOURS_0001 - 1 hour marker
 * @property {string} HOURS_0050 - 50 hours marker
 * @property {string} HOURS_0100 - 100 hours marker
 * @property {string} HOURS_0150 - 150 hours marker
 * @property {string} HOURS_0200 - 200 hours marker
 * @property {string} HOURS_0250 - 250 hours marker
 * @property {string} HOURS_0300 - 300 hours marker
 * @property {string} HOURS_0350 - 350 hours marker
 * @property {string} HOURS_0400 - 400 hours marker
 * @property {string} HOURS_0450 - 450 hours marker
 * @property {string} HOURS_0500 - 500 hours marker
 * @property {string} HOURS_1000 - 1000 hours marker
 * @property {string} HOURS_1500 - 1500 hours marker
 * @property {string} HOURS_2000 - 2000 hours marker
 * @property {string} HOURS_UPEQ - Unpredicted Expense Equal Seperate
 * @property {string} HOURS_OSEQ - Over Sea Equipments
 */
const Utilizated = {
    HOURS_OSEQ: "HOURS_OSEQ",
    HOURS_UPEQ: "HOURS_UPEQ",
    HOURS_0000: "HOURS_0000",
    HOURS_0001: "HOURS_0001",
    HOURS_0050: "HOURS_0050",
    HOURS_0100: "HOURS_0100",
    HOURS_0150: "HOURS_0150",
    HOURS_0200: "HOURS_0200",
    HOURS_0250: "HOURS_0250",
    HOURS_0300: "HOURS_0300",
    HOURS_0350: "HOURS_0350",
    HOURS_0400: "HOURS_0400",
    HOURS_0450: "HOURS_0450",
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
module.exports.CalcType = CalcType;
module.exports.QuarterType = QuarterType;