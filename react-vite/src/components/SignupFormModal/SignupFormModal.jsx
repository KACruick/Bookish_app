import { useState } from "react";
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
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
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
            {errors.email && <p>{errors.email}</p>}
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
          {errors.username && <p>{errors.username}</p>}
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
          {errors.username && <p>{errors.username}</p>}
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
          {errors.username && <p>{errors.username}</p>}
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
          {errors.password && <p>{errors.password}</p>}
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
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
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
