import app from '../app.js';
import userRouter from "./user-route.js";
import albumRouter from "./album-route.js";
import sessionRouter from "./session-route.js";
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const route = (app) =>{
    app.use("/users",userRouter);
    app.use("/api/sessions",sessionRouter);
    app.use("/albums",albumRouter);
}

export default route;