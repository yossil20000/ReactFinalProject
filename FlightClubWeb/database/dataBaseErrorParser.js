
const parseValidationError = (error) => {
  let err = {}
  let errors = []
  try {
    const obj = JSON.parse(JSON.stringify(error.errors))
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
  switch (error.name || "") {
    case "ValidationError":
      return { errorType: "VALIDATION", errors: parseValidationError(error) };
    case "CastError":
      return { errorType: error.name.toUpperCase(), errors: parseCastError(error) };
    case "ExpressValidator":
      return { errorType: "VALIDATION", errors: error.errors.errors };
    case "EXCEPTION":
      return { errorType: error.name, errors: [error.error] };
    case "MongoServerError":
      return { errorType: error.name.toUpperCase(), errors: error.message };
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