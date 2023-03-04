import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.scss';

const Register = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadUrl,
            });
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadUrl,
            });
            await setDoc(doc(db, 'userChats', res.user.uid), {});
            navigate('/');
          });
        }
      );
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
            <label htmlFor="name">Name</label>
            <input id="name" type="text" />
          </div>
          <div className="input_field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" />
          </div>
          <div className="input_field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" />
          </div>
          <div className="input_field">
            <label htmlFor="avatar">Avatar</label>
            <input id="avatar" type="file" />
          </div>
          <button>Register</button>
          {error && <span>Something went wrong</span>}
          <p>
            Do you have an account?{' '}
            <Link to="/login">
              <span>Login</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
