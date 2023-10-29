// UserContext.js
import { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { initialState } from './userReducer';
import axios from 'axios';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const getInitState = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  const [user, setUser] = useState(getInitState);

  const hasRun = useRef(false);



  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  },[user])

  const updateUser = (newUserData) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...newUserData }
      console.log('updatedUser in context', updatedUser)
      // localStorage.setItem('user', JSON.stringify(updatedUser))
      return updatedUser;
    });
  };
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };


  return (
    <UserContext.Provider value={{ user, updateUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
