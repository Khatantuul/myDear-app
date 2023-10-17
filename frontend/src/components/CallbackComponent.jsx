import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useUserContext } from './../context/usercontext';



const CallbackComponent = () => {

  const [redirect, setRedirect] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const { user, updateUser } = useUserContext();


  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {

    if (!hasRun.current){
      
      const exchangeCodeForAccessToken = async (code) => {
        try {
        const response = await axios.post('http://localhost:9000/users', { code },{
          withCredentials: true
        })
        .then((res)=>{
          console.log('res.data in callback', res.data);
          updateUser({ username: res.data.username, authenticated: true, userID: res.data.userID});
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
          console.log("so login function is triggered")
        const response = await axios.post('http://localhost:9000/users/oauth/login', { authC },{
          withCredentials: true
        })
        .then((res)=>{
          console.log('res.data in callback', res.data);
          updateUser({ username: res.data.username, authenticated: true, userID: res.data.userID});
          setResponseData(res.data);
          navigate(`/accounts/${res.data.userID}/studiospace`);
        })
        .catch((err)=>{
          console.log(err)
        })    
      } catch (error) {
        console.error('Error exchanging code for access token:', error);
    
      }
    };
    
    const getQueryParams = (param) => {
      const params = new URLSearchParams(window.location.search);
      console.log('authcode in the front', params.get(`${param}`));
      return params.get(`${param}`);
    };
    
    const authCode = getQueryParams('code');
    console.log('authcode in callback', authCode)
    const stateParam = getQueryParams('state');
    const state = stateParam ? JSON.parse(stateParam) : null;
    console.log('state in callback', state);
    if (authCode && state === null) {
      exchangeCodeForAccessToken(authCode);
    }
    if (authCode && state.login){
      exchangeCodeForAccessTokenForLogin(authCode)
    }

    hasRun.current = true;
  }
  }, []);



  return (
    <div>Loading...</div>
  )
}

export default CallbackComponent