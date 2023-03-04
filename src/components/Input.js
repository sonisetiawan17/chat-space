import React, { useContext, useState } from 'react';
import { GrGallery } from 'react-icons/gr';
import { IoSendSharp } from 'react-icons/io5';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { v4 as uuid } from 'uuid';
import '../styles/Input.scss';
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const [inputValue, setInputValue] = useState('');
  const [img, setImg] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        (error) => {
          // setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                inputValue,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadUrl,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          inputValue,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        inputValue,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        inputValue,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    setInputValue('');
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="file"
        style={{ display: 'none' }}
        id="file"
        onChange={(e) => setImg(e.target.files[0])}
      />
      <label htmlFor="file">
        <GrGallery className="gallery_icon" />
      </label>
      <input
        type="text"
        placeholder="Write a something"
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsButtonDisabled(e.target.value === '');
        }}
        value={inputValue}
      />
      <button disabled={isButtonDisabled} onClick={handleSend}>
        <IoSendSharp className="send_icon" />
      </button>
    </div>
  );
};

export default Input;
