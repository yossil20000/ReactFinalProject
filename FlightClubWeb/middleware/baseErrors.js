const parseApplicationError = require('../database/dataBaseErrorParser')
var log = require('debug-level').log('baseError');
class CError {
  constructor(message,property){
    this.message = message;
    this.property = property;
  }
}
class ApplicationError extends Error {
  errorCode = 500;
  errorSource = "Exeption";
  errors= "";
  constructor(message,errorCode,errorSource,errors){
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.errorSource = errorSource;
    this.errors = errors;
    Object.setPrototypeOf(this,ApplicationError.prototype)
  }
  /* get name() {return this.name} */
  serializeError() {

    const parse = parseApplicationError(this.errors)
    log.error("serializeError/result", this.errorSource,parse.errors)
    return {errorSource:this.errorSource ,...parse};
  }
}

class UserfacingError  extends ApplicationError {
  
}
class DatabaseError extends ApplicationError {}

module.exports = {
  ApplicationError,
  DatabaseError,
  UserfacingError
}