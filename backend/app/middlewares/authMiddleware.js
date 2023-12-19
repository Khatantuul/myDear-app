export const isAuthenticated = (req, res, next) => {
    if (req.session.user){
        req.session._garbage = Date()
        req.session.to
        next();
    }else{
        res.status(401).json({error: "Not authenticated!"})
    }
}