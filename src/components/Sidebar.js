import React from 'react';
import Navbar from './Navbar';
import Search from './Search';
import ChatLists from './ChatLists';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <ChatLists />
    </div>
  );
};

export default Sidebar;
