import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="form_container">
      <div className="form_wrapper">
        <h3>Chat Space</h3>
        <form onSubmit={handleSubmit}>
          <div className="input_field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" />
          </div>
          <div className="input_field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" />
          </div>
          <button>Login</button>
          {error && <span>Something went wrong</span>}
          <p>
            Do you have an account?{' '}
            <Link to="/register">
              <span>Register</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
