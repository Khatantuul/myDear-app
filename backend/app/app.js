import express from "express";
import cors from "cors";
import multer from "multer";
import { uploadFile } from "./../s3.js";
import mongoose from "mongoose";
import {config} from "dotenv";
import route from "./routes/index.js";
import session from "express-session";
import MongoStore from 'connect-mongo'; 
import Album from "./models/album.js";


const upload = multer({ dest: 'uploads/' }); 
const store = new session.MemoryStore();

const app = express();
config();


mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Connected to database");
})
.catch(err=>console.log(err))

const sessionStore = new MongoStore({
    mongoUrl: process.env.DB_URI,
    collection: 'sessions',
    ttl: parseInt(1000 * 60 * 60 * 2)
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,  
    exposedHeaders: ['Etag'],
    allowedHeaders: ['Content-Type', 'Authorization','preview']
  }));
app.use(session({
    name: 'sid',
    secret: 'secretthatissecretsokeepthesecret', 
    store: sessionStore,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        sameSite: true,
        secure: false, 
        maxAge: 1000 * 60 * 60 * 2 
    }
}))

route(app);


export default app;
