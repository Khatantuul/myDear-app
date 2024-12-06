import User from "../models/user.js";
import axios from "axios";
import {config} from 'dotenv';
import pkg from "mongoose";
import bcrypt from 'bcrypt';


config();
const {ValidationError} = pkg;

//saving new User details
export const saveUser = async (newUser) => {

    const user = new User(newUser);
    return await user.save();
        
  }


  
  export const read = async(id) =>{
    const user = User.findById(id).exec()
    return user;
  }


export const checkIfExists = async (email) => {
    try{
        const user = await User.findOne({email}).exec();
        if (user){
            return user._id;
        }else{
            return null;
        }       
    }catch(err){
        throw err;
    }
}

export const checkByGoogleID = async (googleID) => {
    try{
        const user = await User.findOne({googleID}).exec();
        if (user){
            return user;
        }else{
            return null;
        }       
    }catch(err){
        throw err;
    }
}



export const addUserGoogleID = async (id, googleID) => {
    try{
        const user = await User.findOneAndUpdate(
            { _id: id },
            { $set: { googleID: googleID } },
            { new: true } 
        ).exec();
    
        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }catch(err){
        if (err instanceof ValidationError){
            err.status = 400;
        }
        throw err;
    }
}
  

export const getPersonDetails = async (accessToken) => {
    try{  
        const userInfo = await axios
        .get('https://people.googleapis.com/v1/people/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {personFields: 'names,emailAddresses,birthdays,locales,locations'}
        })
        .then((response) => {
        
            return response.data;
        })
        .catch((err) => {
          console.log("Error in getting user details from People API", err);
          throw err;
        });
        return userInfo;
    }catch(err){
        console.log("Error in getPersonDetails", err);
        throw err;
    }
}

export const exchange = async (authCode) => {
    try{
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const redirectUri = process.env.REDIRECT_URI;
        const accessT = await axios.post('https://oauth2.googleapis.com/token',{
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret
            
        })
        return accessT;
    }catch(err){
        throw err;
    }
}

export const authenticateUser = async (email, password) => {
    try{
        const user = await User.findOne({email}).exec()

        if (!user){
            throw new Error("User not found");
        }

        const isPasswordMatch = bcrypt.compare(password, user.password);

        if (!isPasswordMatch){
            throw new Error("Invalid password");
        }

        return user;
    }catch(err){
        throw err;
    }

}