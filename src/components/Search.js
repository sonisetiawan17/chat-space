import React, { useContext, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Search.scss';
import { AuthContext } from '../context/AuthContext';

const Search = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setError(true);
    }
  };

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch();
  };

  const handleSelect = async () => {
    const combinedUserId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, 'chats', combinedUserId));

      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedUserId), { messages: [] });

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedUserId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedUserId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedUserId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedUserId + '.date']: serverTimestamp(),
        });
      }
    } catch (error) {}
    setUser(null);
    setUsername('');
  };

  return (
    <div className="search">
      <div className="search_input">
        <input
          type="text"
          placeholder="Search friends"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <BiSearch className="search_icon" />
      </div>
      {error && <span>User not found</span>}
      {user && (
        <div className="search_friends" onClick={handleSelect}>
          <img src={user.photoURL} alt="User" />
          <p>{user.displayName}</p>
        </div>
      )}
    </div>
  );
};

export default Search;
