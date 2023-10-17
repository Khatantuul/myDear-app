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
  console.log('user genee', user)

  try{
    const foundUser = await User.findById(user.userID);
    console.log('found user', foundUser)

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
    console.log('user in logout session ', user)
   
    if (user){
      console.log('its called')
      req.session.destroy((err)=>{
        if (err){
          setErrorResponse(err, res);
        }else{
          setSuccessResponse({message: "Logout successful"}, res, true);
        }
      })
    }else{
      console.log("no user")
    }
   
  }catch(err){
    setErrorResponse(err, res);
  }
}