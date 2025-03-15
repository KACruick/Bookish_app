import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const { closeModal } = useModal();

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Client-side validation for email and password matching
  useEffect(() => {
    const newValidationErrors = {};

    if (email && !validateEmail(email)) {
      newValidationErrors.email = "Please provide a valid email address";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newValidationErrors.confirmPassword = "Passwords must match";
    }


    setValidationErrors(newValidationErrors);
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Check if there are any validation errors before submitting the form
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
        firstName,
        lastName
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="sign-up-container">

      <h1>Sign Up</h1>

      <div className="errors-container">
        {validationErrors.email && <p>{validationErrors.email}</p>}
        {validationErrors.username && <p>{validationErrors.username}</p>}
        {validationErrors.password && <p>{validationErrors.password}</p>}
        {validationErrors.confirmPassword && (
          <p>{validationErrors.confirmPassword}</p>
        )}
        {errors.email && <p>{errors.email}</p>}
        {errors.username && <p>{errors.username}</p>}
        {errors.password && <p>{errors.password}</p>}
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      </div>


      {errors.server && <p>{errors.server}</p>}
      <div className="signup-div">
      <form className="signup-form" onSubmit={handleSubmit}>

        <div className="label-and-input"> 
          <label>
            Email
          </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* {errors.email && <p>{errors.email}</p>} */}
        </div>

        <div className="label-and-input">
          <label>
            Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          {/* {errors.username && <p>{errors.username}</p>} */}
        </div>

        <div className="label-and-input">
          <label>
            First name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          
        </div>

        <div className="label-and-input">
          <label>
            Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
         
        </div>
       
        <div className="label-and-input">
          <label>
            Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          {/* {errors.password && <p>{errors.password}</p>} */}
        </div>

        <div className="label-and-input">
          <label>
            Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          {/* {errors.confirmPassword && <p>{errors.confirmPassword}</p>} */}
        </div>

        <div className="sign-up-button-div">
          <button className="sign-up-button" type="submit">Sign Up</button>
        </div>


      </form>
      </div>
    </div>
  );
}

export default SignupFormModal;
