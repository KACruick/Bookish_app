import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="login-modal-container">
      <h1>Log In</h1>

      <div className="error-container">
      {errors.email && <p className="error">{errors.email}</p>}
      {errors.password && <p className="error">{errors.password}</p>}
      </div>

      <form className='login-form' onSubmit={handleSubmit}>
        
        <div className="email">
        <label>
          Email
        </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          />
        </div>

        {/* {errors.email && <p className="error">{errors.email}</p>} */}

        <div className="password">
        <label>
          Password
        </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
        </div>

        {/* {errors.password && <p className="error">{errors.password}</p>} */}
        <button className='login-button' type="submit">Log In</button>

      </form>

      <div className='demo-user-div'>
        <button 
          type="button" 
          className="demo-user-button"
          onClick={() => {
              return dispatch(thunkLogin({ email: 'Kendra.Cruick@io.com', password: 'password1' }))
              .then(closeModal)
              .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                  setErrors(data.errors);
                }
              });
          }}
          >
          Demo User
        </button>
      </div>

    </div>
  );
}

export default LoginFormModal;
