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
    origin: 'https://my-dear-app.vercel.app',
    credentials: true,  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    exposedHeaders: ['Etag'],
    allowedHeaders: ['Content-Type', 'Authorization','preview']
  }));

app.options('*', cors());

app.use(session({
    name: 'sid',
    secret: process.env.SESSION_SECRET, 
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
