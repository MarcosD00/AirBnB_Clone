import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="sing-up-form">
      <h1>Sign Up</h1>
          {errors.firstName && <p className="error-popup">{errors.firstName}</p>}
          {errors.lastName && <p className="error-popup">{errors.lastName}</p>}
          {errors.email && <p className="error-popup">{errors.email}</p>}
          {errors.username && <p className="error-popup">{errors.username}</p>}
          {errors.password && <p className="error-popup">{errors.password}</p>}
          {errors.confirmPassword && (<p className="error-popup">{errors.confirmPassword}</p>)}

      <form onSubmit={handleSubmit}>
          
      <p>First Name</p>
        <label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <p>Last Name</p>
        <label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
          <p>Email</p>
        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
          <p>Username</p>
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
          <p>Password</p>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
          <p>Confirm Password</p>
        <label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button 
        className="submit"
         disabled={
          email.length < 1 || username.length < 4 || firstName.length < 1 || lastName.length < 1 || password.length < 6 ||
          confirmPassword.length < 6
      }
        type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;