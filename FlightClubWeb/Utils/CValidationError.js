class CValidationError {
  value;
  msg;
  param;
  location;
  constructor(value,msg,param,location){
    this.location = location;
    this.msg = msg;
    this.param = param;
    this.value = value
  }
  get validationResult(){
    return {
      errors: [
        {
          value: this.value,
          msg: this.msg,
          param: this.param,
          location: this.location
        }
      ]
      
    }
  }

}
module.exports = {
 CValidationError
}