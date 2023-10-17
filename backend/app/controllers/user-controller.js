import {config} from 'dotenv';
import * as userServices from './../services/user-service.js'
import axios from 'axios';
import bcrypt from 'bcrypt';

const setSuccessResponse = (obj, res) =>{
    res.status(200);
    res.json(obj);
}

const setErrorResponse = (err,res) =>{
    const status = err.status || 500;
    const message = err.message || "Internal Server Error"
    res.status(status)
    res.json({error:message})
}

export const getUserBasic = async (req,res) => {

}

export const authenticate = async (req,res) => {
    try{
        const {email, password} = req.body;
        const user = await userServices.authenticateUser(email,password.trim());
        if (user){
            const userSession = createSession(user);
            req.session.user = userSession;
            setSuccessResponse(userSession, res);
            }else{
                const err = new Error("Incorrect password");
                err.status = 403;
                throw err;
            }
    }catch(err){
        setErrorResponse(err,res);
    }
}

export const authenticateOauth = async (req,res) => {
    
    try{
        
        const authcode = req.body.authC;
        const response = await userServices.exchange(authcode);
        const accessToken = response.data ? response.data.access_token : response.access_token;
        const userDetails = await userServices.getPersonDetails(accessToken);
        
        if (userDetails.data){
            // const email = userDetails.data.emailAddresses[0].value;
            const googleID = userDetails.data.resourceName.split('/')[1];
            console.log("googleID", googleID)
            const user = await userServices.checkByGoogleID(googleID);
            if (user){
                const userSession = createSession(user);
                req.session.user = userSession;
                setSuccessResponse(userSession, res);
                }else{
                    const err = new Error("User not found");
                    err.status = 401;
                    throw err;
                }
            }
        }catch(err){
            setErrorResponse(err,res);
        }
    }


export const postUser = async (req, res) => {

    try{
        const authCode = req.body.code;
        const response = await userServices.exchange(authCode);
        const accessToken = response.data ? response.data.access_token : response.access_token;
        const userDetails = await userServices.getPersonDetails(accessToken);

        if (userDetails.data){
            const googleID = userDetails.data.resourceName.split('/')[1];
            const firstname = userDetails.data.names[0].displayName.split(' ')[0];
            const lastname = userDetails.data.names[0].displayName.split(' ')[1];
            const email = userDetails.data.emailAddresses[0].value; 
            // console.log("email in userDetails.data", email)
            const username = email.split('@')[0];
            const userObjectID = await userServices.checkIfExists(email);
            if (userObjectID != null){
                    const err = new Error("Account already exists");
                    err.status = 409;
                    throw err;
            }else{
           
                if (googleID && email){
                
                    const registeredUser = await userServices.saveUser({googleID, firstname, lastname, username,email});
                    const userSession = createSession(registeredUser);
                    req.session.user = userSession;
                    console.log('session',req.session);
                    setSuccessResponse(userSession, res);
                }else{
                    setErrorResponse(new Error('Missing essential user data'), res);
                }
            }

        }else{
            const err = new Error("No account info received from google");
            err.status = 409;
            throw err;
        }


    }catch(err){
        setErrorResponse(err,res);
    }
}

export const postUserNonOauth = async (req, res) => {

    try{
        const {email, password, firstname, lastname} = req.body;
        const username = email.split('@')[0];

        const userObjectID = await userServices.checkIfExists(email);
        if (userObjectID){
            const err = new Error("User already exists");
            err.status = 409;
            throw err;
        }

        if (!email || !password || !firstname || !lastname){
            const err = new Error("Missing required fields");
            err.status = 400;
            throw err;
        }

        const trimmedPass = password.trim();
        const hashedPassword = await bcrypt.hash(trimmedPass, 10);
        const registeredUser = await userServices.saveUser({email, password: hashedPassword, firstname, lastname, username});

        setSuccessResponse(registeredUser, res);

    }catch(err){
        setErrorResponse(err,res);
    }
}


export const exchangeAuthCodeForAccessToken = async (req,res) => {
    // console.log("exchangeAuthCodeForAccessToken fired")

    const { code } = req.body;
    // console.log("inside exchange, authcode: ",code)
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    // console.log("happening here")
    try{
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token',{
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3000/callback',
            client_id: clientId,
            client_secret: clientSecret
            
        })

        setSuccessResponse(tokenResponse.data, res);
        // console.log("its inside exchangeauthcodefortoken",tokenResponse.data);
    }catch(err){
        // console.error('Error in exchangeAuthCodeForAccessToken:', err);
        setErrorResponse(err,res);
    }

}

export const createSession = (user) => {
    return {userID: user.id, username: user.username, authenticated: true};
}