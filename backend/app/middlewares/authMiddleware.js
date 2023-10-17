export const isAuthenticated = (req, res, next) => {
    if (req.session.user){
        console.log("yes you are", req.session)
        next();
    }else{
        res.status(401).json({error: "Not authenticated!"})
    }
}