import {useRef,useState, useEffect} from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { IconButton } from '@mui/material';
import { VisibilityOff, VisibilityOutlined } from '@mui/icons-material';
import './login-page.css';
import {Brand} from '../components';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { useUserContext } from './../context/usercontext';
import apiClient from '../util/apiClient';


const Test = () => {


    const [values, setValues] = useState({
        email: '',
        password: ''
    })
 
    const [error, setError] = useState(false); 
    const [passwordType, setPasswordType] = useState('password');
    const [visible, setVisible] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [notAuthenticated, setNotAuthenticated] = useState(false);
    const [notRegistered, setNotRegistered] = useState(false);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const navigate = useNavigate();
    const { user, updateUser } = useUserContext();



    const handleChange = (e) =>{
        setValues(prev=>({...prev, [e.target.name]:e.target.value}))
    }
    
   
    const handleSubmit = async (e) => {
        // e.preventDefault();

        if(values.email === '' || values.password === ''){
            setError(true);
        }else if (((!values.email.includes('@')) && (!values.email.includes('.'))) || (values.password.length < 8)){
            setInvalid(true);
            return;
        }else{
            setInvalid(false);
            
            const data = await apiClient.post('/users/login', values, {
                withCredentials: true
            })

            .then((res)=>{
                updateUser({ username: res.data.username, authenticated: true, userID: res.data.userID});
                navigate(`/accounts/${res.data.userID}/studiospace`);
            })
            .catch((err)=>{
                //show error in ui
                setInvalid(false);
                setNotAuthenticated(true);
            });
        }    
    }

    const handleVisibility = () => {
        if (passwordType === 'password'){
            setPasswordType('text');
            setVisible(true);
        }else{
            setPasswordType('password');
            setVisible(false);
        }
    }
     

    const login = useGoogleLogin({
            
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: '/callback',
        state: JSON.stringify({ login: true })
    })


      useEffect(()=>{
        const getQueryParams = () => {
            const params = new URLSearchParams(window.location.search);
            return params.get('message');
        }
        const message = getQueryParams();
        if(message === 'AccountAlreadyExists'){
            setAlreadyRegistered(true);
        }
      },[])

  return (
    <div class='container'>
        <div class='formcontainer'>
            <div class='signup-section'>
            <span class="signup-link-text">Don't have an account yet?</span>
            <Link to="/signup" class='signup-link-aTag'>Sign Up</Link>
            </div>
            <div class='content-section'>
                <Brand/>
                <main class='auth-container'>
                    <div class='auth-content'>
                        <div class='form-headline-wrapper'>
                            <h2 class='form-headline-text'>Welcome, anytime!</h2>
                        </div>
                        <div class='form-validation-error-wrapper' invalid={invalid.toString()}>
                            <span class='error-icon'></span>
                            <p>Please review the form and provide valid information.</p>
                        </div>
                        <div class='authentication-error-wrapper' invalid={notAuthenticated.toString()}>
                            <span class='error-icon'></span>
                            <p>Invalid credentials. Please check them and try again!</p>
                        </div>
                        <div class='not-registered-error-wrapper' invalid={notRegistered.toString()}>
                            <span class='error-icon'></span>
                            <p>No account was found with us. Please sign up and join! </p>
                        </div>
                        <div class='already-registered-error-wrapper' invalid={alreadyRegistered.toString()}>
                            <span class='error-icon'></span>
                            <p>You already have an account with us. Try login.</p>
                        </div>
                        
                        <div class='form-fieldset-wrapper'>
                            <div class='form-email-fieldset-wrapper'>
                                <div class='email-field-label-wrapper'>
                                    <label for='email' class="email-field-label">Email</label>
                                </div>
                                <div class='email-field-wrapper'>
                                    <input class='email-input' type='email' name='email' 
                                    id='email' placeholder='john@denver.com' onChange={handleChange}                      
                                    />
                                    {/* {leftEmpty && */}
                                    {error&&values.email.length<=0?
                                    <p class="error-message">
                                    Please enter your email address</p>:""}
                                </div>
                            </div>
                            <div class='form-password-fieldset-wrapper'>
                                <div class='password-field-label-wrapper'>
                                    <label for='password' class="password-field-label">Password</label>
                                </div>
                                <div class='password-field-wrapper'>
                                    <input class='password-input' type={passwordType} name='password' 
                                    id='password' placeholder='At least 8 characters' 
                                    onChange={handleChange} 
                                
                                    pattern='^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$'
                            
                                    // passwordValid={passwordValid.toString()}
                                    />
                                    <IconButton onClick={handleVisibility} sx={{position:'absolute',right:'3px',top:'3px'}}>
                                        {visible&&passwordType==='text'?
                                        <VisibilityOff fontSize='small'/>:""}
                                        {!visible&&passwordType==='password'?
                                        <VisibilityOutlined fontSize='small'/>:""}
                                    </IconButton>
                                    {error&&values.password.length<=0?
                                    <p class="error-message">
                                    Please enter your password</p>:""}
                                </div>
                            </div>
                        </div>
                        <div class='forgotten-password-link-wrapper'>
                            <a class='forgotten-password-link'>Forgot Password?</a>
                        </div>
                        <div class='form-button-wrapper' onClick={handleSubmit} >
                            <input class='form-button' type='submit' 
                            value='Log in to MyDear' />
                        </div>
                    <div class='oauth-wrapper'>
                        <div class='oauth-divider-wrapper'>
                            <span class='oauth-divider-text'>OR</span>
                        </div>
                        <a class='oauth-google-link-button' onClick={() => login()}>Log in with Google</a>
                 
                    </div>
                    </div>
                 
                </main>

            </div>
        </div>
    </div>
  )

}

export default Test