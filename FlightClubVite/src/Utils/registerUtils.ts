
const passwordRequirement = "Checks that a input has a minimum of 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number , and 1 @ or $ with no spaces."
const passwordPattern = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[@$]).{8,})\S$/
const usernamePattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@_])[^<>?$&*%()+-]{8,12}$/
export interface ICheckPassword {
  valid: boolean;
  validation: string[];
}
export default function checkPassword(password:string | undefined,verifiedPassword: string) : ICheckPassword {
  let check : ICheckPassword ={
    valid: false,
    validation: []
  }
  if(password === undefined  || password == "" ){
    
    check.validation.push(passwordRequirement);
  }
  else if(IsPasswordValid(password)){
    if(password !== verifiedPassword){
      check.validation.push("Password and verified password not identical");
    }else{
      check.valid = true;
    }
  }
  else{
    check.validation.push(passwordRequirement);
  }
  console.log("checkPassword",check,password,verifiedPassword)
  return check;
}

export function IsPasswordValid(password : string) : boolean{
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@_])[^<>?$&*%()+-]{8,}$/.test(password)
}

export function IsUsernaaameValid(username: string) : boolean{
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@_])[^<>?$&*%()+-]{8,12}$/.test(username)
}

export  function checkUsername(username:string ) : ICheckPassword {
  let check : ICheckPassword ={
    valid: false,
    validation: []
  }
  if(username === undefined || username == "" ){
    
    check.validation.push(passwordRequirement);
  }
  else if(IsUsernaaameValid(username)){
      check.valid = true;
    
  }
  else{
    check.validation.push(passwordRequirement);
  }
  console.log("checkUsername",check,username)
  return check;
}