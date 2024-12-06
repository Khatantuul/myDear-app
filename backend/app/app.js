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

const sessionStore = MongoStore.create({
    mongoUrl: process.env.DB_URI,
    collectionName: 'sessions',
    ttl: 60 * 60 * 2, 
});

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
    proxy: true, 
    name: 'sessionForMyDearApp',
    cookie: {
        sameSite: 'none',
        secure: true, 
        maxAge: 1000 * 60 * 60 * 2, 
        httpOnly: true
    }
}))

app.use((req, res, next) => {
    console.log("Session ID:", req.sessionID);
    console.log("Session Data:", req.session);
    res.on("finish", () => {
        console.log("Response Headers:", res.getHeaders());
    });
    next();
});


route(app);


export default app;