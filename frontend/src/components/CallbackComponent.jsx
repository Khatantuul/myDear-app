import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useUserContext } from './../context/usercontext';
import { BallTriangle } from "react-loader-spinner";
import apiClient from '../util/apiClient';


const CallbackComponent = () => {
  const spinnerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  }

  const [redirect, setRedirect] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const { user, updateUser } = useUserContext();


  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {

    if (!hasRun.current){
      
      const exchangeCodeForAccessToken = async (code) => {
        try {
        const response = await apiClient.post('/users', { code },{
          withCredentials: true
        })
        .then((res)=>{
          updateUser({ username: res.data.username, authenticated: true, userID: res.data.userID,
                      email: res.data.email, firstName: res.data.firstname, lastName: res.data.lastname,});
          setResponseData(res.data);
          navigate(`/accounts/${res.data.userID}/studiospace`);
        })
        .catch((err)=>{
          console.log(err)
        })    
      } catch (error) {
        console.error('Error exchanging code for access token:', error);
        
        if (error.response && error.response.status === 409) {
          window.location.href = '/login?message=AccountAlreadyExists';
        }
      }
    };
      const exchangeCodeForAccessTokenForLogin = async (authC) => {
        try {
        
          const response = await apiClient.post('/users/oauth/login', { authC },{
            withCredentials: true
        })
        .then((res)=>{
          updateUser({ username: res.data.username, authenticated: true, userID: res.data.userID,
            email: res.data.email, firstName: res.data.firstname, lastName: res.data.lastname,});
          setResponseData(res.data);
          navigate(`/accounts/${res.data.userID}/studiospace`);
        })
        .catch((err)=>{
          console.log("Error in exchange: ",err);
        })    
      } catch (error) {
        console.error('Error exchanging code for access token:', error);
    
      }
    };
    
    const getQueryParams = (param) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(`${param}`);
    };
    
    const authCode = getQueryParams('code');
    console.log("I am getting the code",authCode);
    const stateParam = getQueryParams('state');
    const state = stateParam ? JSON.parse(stateParam) : null;
    if (authCode && state === null) {
      exchangeCodeForAccessToken(authCode);
    }
    if (authCode && state && state.login ){
      exchangeCodeForAccessTokenForLogin(authCode)
    }

    hasRun.current = true;
  }
  }, []);



  return (
    <div className="spinner-container" style={spinnerStyle}>
    <BallTriangle />
  </div>
  )
}

export default CallbackComponent