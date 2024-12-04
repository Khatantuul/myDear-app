import {useState, useEffect} from 'react'
import { IconButton } from '@mui/material';
import { VisibilityOff, VisibilityOutlined, KeyboardReturnOutlined } from '@mui/icons-material';
import './signup-page.css';
import {Brand} from '../components';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


const EML_RGX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_RGX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,24}$/;

const SignUp = () => {


    const [values, setValues] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: ''
    })

    const [generalRegistration, setGeneralRegistration] = useState(true);
    const [passwordType, setPasswordType] = useState('password');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState(false);
    const [emailError, setEmailError] = useState(false); 
    const [pwdError, setPwdError] = useState(false); 
    const [invalid, setInvalid] = useState(false);
    const [accountExists, setAccountExists] = useState(false);

    const handleReturn = () =>{
        if (generalRegistration === true) {
            setGeneralRegistration(false);
        }else{
            setGeneralRegistration(true)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (values.email.length <= 0 || values.password.length <= 0 || 
            values.firstname.length <= 0 || values.lastname.length <= 0){
                setError(true);
                return;
            }

        if (emailError || pwdError){
            setInvalid(true);
            return;
        }
        setInvalid(false);

        const response = await axios.post('http://localhost:9000/users/signup', values)
        .then(res => {
            if (res.status >= 200 && res.status < 300){
                window.location.href = 'http://localhost:3000/auth';
            }
        })
        .catch(err => {
            setAccountExists(true);
        })
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

    const handleOnBlur = (e) => {
        // if (e.target.value === ''){
        //     setError(true);
        // }
    }

    const handleChange = (e) =>{
        setValues(prev=>({...prev, [e.target.name]:e.target.value}))
}

   

    useEffect(()=>{
        const result = EML_RGX.test(values.email);
        setEmailError(!result);
    },[values.email])

    useEffect(()=>{
        const result = PWD_RGX.test(values.password);
        setPwdError(!result);
    },[values.password])


      const loginAuthCode = useGoogleLogin({
            
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: 'http://localhost:3000/callback'
    })
    

  return (
   
        <div class='form-container'>
            <section class='right-section'>
                <div className="rightsection-content-wrapper">
                    <h1>Sign up to your happiest place</h1>
                
                    <img src='./assets/baby.jpeg' alt='sign-up-img'/>
                </div>
            </section>
            <section class='left-section'>  
                {!generalRegistration&& 
                <div className="signup-page-return-wrapper">
                    <IconButton onClick={handleReturn}>
                        <KeyboardReturnOutlined fontSize='medium'/>
                    </IconButton>
                </div>}
                <div class='signin-section'>
                    <span class="signin-link-text">Already have an account?</span>
                    <a href="http://localhost:3000/login" class='signin-link-aTag'>Log in</a>
                </div>
                {generalRegistration? 
                    <div className="signup-form-wrapper">
                        <div className="signup-content">
                        <Brand/>
                        <h2>Collect memories with your kids and share the bond.</h2>
                        <div className="signup-oauth-wrapper">
                            <a class='signup-oauth-google-link-button' 
                            onClick={() => loginAuthCode()}
                            >Sign Up with Google</a>
                        <div class='signup-oauth-divider-wrapper'>
                            <span class='signup-oauth-divider-text'>OR</span>
                        </div>
                            <div class='signup-button-wrapper' onClick={handleReturn} >
                                <input class='signup-button' type='submit' 
                                value='Sign up with email' />
                            </div>
                        </div>

                        </div>
                    </div>:
                    <div className="signup-form-wrapper">
                        <div className="signup-content">
                            <Brand/>
                            <h2>Collect memories with your kids and share the bond.</h2>
                            <div className="signup-form-fieldset-wrapper">
                                <div className="signup-form-content">
                                    <div class='signup-form-validation-error-wrapper' invalid={invalid.toString()}>
                                        <span class='error-icon'></span>
                                        <p>Please try again with valid information.</p>
                                    </div>
                                    <div class='signup-form-user-exists-error-wrapper' invalid={accountExists.toString()}>
                                        <span class='error-icon'></span>
                                        <p>You have an account with us. Try login.</p>
                                    </div>
                                    <div className="signup-form-firstname-field-wrapper">
                                        <input class='signup-firstname-input' placeholder='Firstname' 
                                        type='text' name='firstname' id='firstname'
                                        onChange={handleChange} autoComplete='off' onBlur={handleOnBlur} />
                                        {error&&values.firstname.length<=0?
                                        <p class="signup-error-message">
                                        This field cannot be left blank</p>:""}
                                    </div>
                                    <div className="signup-form-lastname-field-wrapper">
                                        <input class='signup-lastname-input' placeholder='Lastname' 
                                        type='text' name='lastname' id='lastname'
                                        onChange={handleChange} autoComplete='off' onBlur={handleOnBlur} />
                                        {error&&values.lastname.length<=0?
                                        <p class="signup-error-message">
                                        This field cannot be left blank</p>:""}
                                    
                                    </div>
                                    <div className="signup-form-email-field-wrapper">
                                        <input class='signup-email-input' placeholder='Email' 
                                        type='email' name='email' id='email'
                                        onChange={handleChange} autoComplete='off' onBlur={handleOnBlur} />
                                        {error&&values.email.length<=0?
                                        <p class="signup-error-message">
                                        This field cannot be left blank</p>:""}
                                        {emailError&&values.email.length>0?
                                        <p class="signup-error-message">
                                        Enter a valid email address</p>:''}
                                    </div>
                                    <div className="signup-form-password-field-wrapper">
                                        <input class='signup-password-input' placeholder='Password' 
                                        type={passwordType} name='password' id='password'
                                        onChange={handleChange} onBlur={handleOnBlur}
                                        pattern='^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$'/>
                                        <IconButton onClick={handleVisibility} sx={{position:'absolute',right:'3px',top:'3px'}}>
                                            {visible&&passwordType==='text'?
                                            <VisibilityOff fontSize='small'/>:""}
                                            {!visible&&passwordType==='password'?
                                            <VisibilityOutlined fontSize='small'/>:""}
                                        </IconButton>
                                        {error&&values.password.length<=0?
                                        <p class="signup-error-message">
                                        This field cannot be left blank</p>:""}
                                        {pwdError&&values.password.length>0?
                                        <p class="signup-error-message">
                                        Use 8 or more characters with a mix upper and lowercase letters, numbers and symbols </p>:''}
                                    </div>
                                    <div class='signup-create-button-wrapper' onClick={handleSubmit} >
                                        <input class='signup-create-button' type='submit' 
                                        value='Create account' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
            </section>
        </div>
  )
}

export default SignUp