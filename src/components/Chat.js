import React, { useContext } from 'react';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { IoPersonAddSharp } from 'react-icons/io5';
import { SlOptionsVertical } from 'react-icons/sl';
import Messages from './Messages';
import Input from './Input';
import '../styles/Chat.scss';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chat_bar">
        <p>{data.user?.displayName}</p>
        <div className="chat_icons">
          <BsFillCameraVideoFill />
          <IoPersonAddSharp />
          <SlOptionsVertical />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
