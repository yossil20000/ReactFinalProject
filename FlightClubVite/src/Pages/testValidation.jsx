import useInput from "../hooks/useInput";

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
let emailContent = <p className="text-[#b40e0e]">Email must not be empty!</p>;
let nameContent = <p className="text-[#b40e0e]">username must not be empty!</p>;
let passwordContent = (
  <p className="text-[#b40e0e]">Please input a valid password</p>
);

const emailCheck = (value) => {
  if (value.trim() === "") {
    emailContent = <p className="text-[#b40e0e]">Email must not be empty!</p>;
  } else if (!regex.test(value)) {
    emailContent = (
      <p className="text-[#b40e0e]">Please enter a valid email!</p>
    );
  } else {
    return value;
  }
};

const nameCheck = (value) => {
  if (value.trim() === "") {
    nameContent = <p className="text-[#b40e0e]">Username must not be empty!</p>;
  } else if (value.length < 2) {
    nameContent = (
      <p className="text-[#b40e0e]">
        Username must not be less than 2 characters!
      </p>
    );
  } else {
    return value;
  }
};

const passwordCheck = (value) => {
  if (value.trim() === "") {
    passwordContent = (
      <p className="text-[#b40e0e]">Password must not be empty!</p>
    );
  } else if (value.length < 5) {
    passwordContent = (
      <p className="text-[#b40e0e]">
        Password cannot not be less than 5 characters!
      </p>
    );
  } else {
    return value;
  }
};

const Signup = (valid) => {
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    inputReset: resetEmailInput
  } = useInput(emailCheck);

  const {
    value: enteredUName,
    isValid: enteredUNameIsValid,
    hasError: usernameInputHasError,
    valueChangeHandler: userNameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    inputReset: resetUNameInput
  } = useInput(nameCheck);

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    inputReset: resetPasswordInput
  } = useInput(passwordCheck);

  let formIsValid = false;

  if (enteredEmailIsValid && enteredUNameIsValid && enteredPasswordIsValid) {
    formIsValid = true;
  }

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    resetEmailInput();
    resetUNameInput();
    resetPasswordInput();
  };

  const emailInput = emailInputHasError ? !valid : valid;
  const uNameInput = usernameInputHasError ? !valid : valid;
  const passwordInput = passwordInputHasError ? !valid : valid;

  return (
    <>
      <div
        className="relative top-[8vh]  w-full md:top-[20vh] mx-auto opacity-100
        max-w-[79vw] md:max-w-lg md:max-h-full"
        id="targ"
      >
        <div className="relative bg-white rounded-lg shadow ">
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 ">
              Sign up to our platform
            </h3>
            <form className="space-y-6" action="#" onSubmit={formSubmitHandler}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-sm 
                  rounded-lg focus:outline-blue-500 focus:border-blue-500 
                  block w-full p-2.5"
                  placeholder="name@gmail.com"
                  required
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                  value={enteredEmail}
                  valid={emailInput}
                />
                {emailInputHasError && emailContent}
              </div>
              <div>
                <label
                  for="password"
                  className="block mb-2 text-sm font-medium"
                >
                  Your username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Johnny"
                  className="bg-gray-50 border border-gray-300 text-sm 
                  rounded-lg focus:outline-blue-500 focus:border-blue-500 
                  block w-full p-2.5"
                  required
                  onChange={userNameChangeHandler}
                  onBlur={usernameBlurHandler}
                  value={enteredUName}
                  valid={uNameInput}
                />
                {usernameInputHasError && nameContent}
              </div>
              <div>
                <label
                  for="password"
                  className="block mb-2 text-sm font-medium"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-sm 
                  rounded-lg focus:outline-blue-500 focus:border-blue-500 
                  block w-full p-2.5"
                  required
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  value={enteredPassword}
                  valid={passwordInput}
                />
                {passwordInputHasError && passwordContent}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-blue-800 
                focus:ring-4 focus:outline-none focus:ring-blue-500 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                disabled:bg-slate-200 disabled:cursor-not-allowed 
                disabled: border-slate-200"
                disabled={!formIsValid}
              >
                Create account
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
