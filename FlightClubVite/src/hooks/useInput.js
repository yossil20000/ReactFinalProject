/* https://codesandbox.io/p/sandbox/form-hook-2hwmwh?file=%2Fsrc%2Fsignup.js&from-embed */
/* https://dev.to/franciscomendes10866/react-form-validation-using-useform-hook-and-superstruct-kd1 */
import { useState } from "react";


const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;

  const valueChangeHandler = (event) => {
    setEnteredValue(event.target.value);
  };

  const inputBlurHandler = (event) => {
    setIsTouched(true);
  };

  const inputReset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    inputValue: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    inputReset
  };
};

export default useInput;
