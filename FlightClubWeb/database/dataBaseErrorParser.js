
const parseValidationError = (error) => {
  let err = {}
  let errors = []
  try {
    let errortoParse = error;
    if(error.errors !== undefined)
    {
      errortoParse = error.errors
    }

    const obj = JSON.parse(JSON.stringify(errortoParse))
    const [keys] = Object.entries(obj) 
    console.log("parseValidationError/key", keys,keys[1].name)
    for (const [key, value] of Object.entries(obj)) {
      console.log(`${key}: `,value.name);
      errors.push({value: value.value,msg: value.message,param: value.path,location: "Body"})
    
    }
    
    console.log("parseValidationError/obj", errors)
/*     const allError = error.message.substring(error.message.indexOf(':') + 1).trim()
    const errorArray = allError.split(",").map((e) => e.trim());
    errorArray.forEach(error => {
      /* const [key,value] = error.split(":").map((e) => e.trim()); */
      /* err[key] = value */
      //errors.push(error);

    //}); */
    return errors;
  }
  catch (err) {
    return ['Unknown: Parsing Error']
  }
}
const parseCastError = (error) => {
  
  try {
    return [`${error.path}: ${error.value} Not Found `]
    
  }
  catch (err) {
    return ['Unknown: Parsing Error']
  }
}
const parseExpressValidator = (error) => {
  
  let err = {}
  let errors = []
  try {
    
    error.forEach(error => {
      
      errors.push(`${error.param}: ${error.value }`);

    });
    return errors;
  }
  catch (err) {
    return ['Unknown: Parsing Error']
  }
}
const parseApplicationError = (error) => {
  let {name, errors} = error;
  name = name == "" ? errors.name : name;
  switch (name) {
    case "ValidationError":
      return { errorType: "VALIDATION", errors: parseValidationError(errors) };
    case "CastError":
      return { errorType: name.toUpperCase(), errors: parseCastError(errors) };
    case "ExpressValidator":
      return { errorType: "VALIDATION",  ...error.errors };
    case "EXCEPTION":
      if(typeof error == 'object'){
        if(error.error.hasOwnProperty("message"))
          return { errorType: name, errors: [error.error.message] };
      }
      return { errorType: name, errors: [errors.error] };
    case "MongoServerError":
      return { errorType: name.toUpperCase(), errors: [errors.message] };
    default:
      return { errorType: "", errors: [error] };
  }
}
module.exports = parseApplicationError

/* {
  "success": false,
  "validation": {
      "errors": [
          {
              "value": "634b88cb993ecfe55e05cc8",
              "msg": "_id must be valid 24 characters",
              "param": "_id",
              "location": "body"
          }
      ]
  },
  "data": []
} */