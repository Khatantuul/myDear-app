import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserContext } from '../context/usercontext.jsx'; // Import your UserContext


const PrivateRoute = () => {
  let { user } = useUserContext();

  return(
    user && user.authenticated ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default PrivateRoute;