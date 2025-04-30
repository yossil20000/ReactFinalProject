var log = require('debug-level').log('dataBaseErrorParser');
const parseValidationError = (error) => {
  let err = {}
  let errors = []
  try {
    let errortoParse = error;
    if (error.errors !== undefined) {
      errortoParse = error.errors
    }

    const obj = JSON.parse(JSON.stringify(errortoParse))
    const [keys] = Object.entries(obj)
    log.error("parseValidationError/key", keys, keys[1].name)
    for (const [key, value] of Object.entries(obj)) {
      log.error(`${key}: `, value.name);
      errors.push({ value: value.value, msg: value.message, param: value.path, location: "Body" })

    }

    log.error("parseValidationError/obj", errors)
    /*     const allError = error.message.substring(error.message.indexOf(':') + 1).trim()
        const errorArray = allError.split(",").map((e) => e.trim());
        errorArray.forEach(error => {
          /* const [key,value] = error.split(":").map((e) => e.trim()); */
    /* err[key] = value */
    //errors.push(error);

    //}); */
    return errors;
  }
  catch (error) {
    return ['Unknown: Parsing Error']
  }
}
const parseCastError = (error) => {

  try {
    return [`${error.path}: ${error.value} Not Found `]

  }
  catch (error) {
    return ['Unknown: Parsing Error']
  }
}
const parseExpressValidator = (error) => {

  let err = {}
  let errors = []
  try {

    error.forEach(error => {

      errors.push(`${error.param}: ${error.value}`);

    });
    return errors;
  }
  catch (error) {
    return ['Unknown: Parsing Error']
  }
}
const parseApplicationError = (error) => {
  let { name, errors } = error;
  name = name == "" ? errors.name : name;
  if(errors == undefined){
   if (error.hasOwnProperty("error")) {
      if (error.error.hasOwnProperty("errors"))
        errors = error.error.errors
      else if (error.error.hasOwnProperty("message"))
        errors = [error.error.message]
      else if (error.error.hasOwnProperty("value"))
        errors = [error.error.value]
      else if (error.error.hasOwnProperty("name"))
        errors = [error.error.name]
      else if (error.error.hasOwnProperty("path"))
        errors = [error.error.path]
      else if (error.error.hasOwnProperty("value"))
        errors = [error.error.value]
      else if (error.error.hasOwnProperty("param"))
        errors = [error.error.param]
      else
      errors = [error.error]
        }
  }
  log.error("parseApplicationError/error", error)
  switch (name) {
    case "ValidationError":
      return { errorType: "VALIDATION", errors: parseValidationError(errors) };
    case "CastError":
      return { errorType: name.toUpperCase(), errors: parseCastError(errors) };
    case "ExpressValidator":
      return { errorType: "VALIDATION", ...error.errors };
    case "Validator":
      return { errorType: "VALIDATION", errors: errors };
    case "EXCEPTION":
      if (typeof error == 'object') {
        if (error.error.hasOwnProperty("message"))
          return { errorType: name, errors: [error.error.message] };
      }
      if(typeof error == 'string'){
        return { errorType: name, errors: [error] };
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