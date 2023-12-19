import User from "./../models/user.js";


const setSuccessResponse = (obj, res, clearCookie=false) =>{
  if(clearCookie){
    res.clearCookie('sid');
  }

  res.status(200);
  res.json(obj);
}

const setErrorResponse = (err,res) =>{
  const status = err.status || 500;
  const message = err.message || "Internal Server Error"

  res.status(status)
  res.json({error:message})
}

export const getUserInfo = async (req, res) => {
  const user = req.session.user;

  try{
    const foundUser = await User.findById(user.userID);
    if (foundUser){
        setSuccessResponse(foundUser, res);
  }else{
      const err = new Error("User not found");
      err.status = 404;
      throw err;
  }

}catch (err){
  setErrorResponse(err, res);
}
}

export const logout = async (req, res) => {
  try{
    const user = req.session.user;
   
    if (user){
      req.session.destroy((err)=>{
        if (err){
          setErrorResponse(err, res);
        }else{
          setSuccessResponse({message: "Logout successful"}, res, true);
        }
      })
    }
  }catch(err){
    setErrorResponse(err, res);
  }
}