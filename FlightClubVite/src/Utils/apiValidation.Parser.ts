import { IValidation } from "../Interfaces/IValidation";

export function apiValidationParse(validation : IValidation) : string{
  return `${validation.param} (${validation.value}) : ${validation.msg} `;
}