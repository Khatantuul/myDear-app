import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    googleID: {type: String, required: false},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: { type: String, required: true},
    email: 
    { type: String, 
      required: true,
      validate: {
        validator: email => User.emailNotExists({email}),
        message: "Email already exists"
      }  },
    password: {type: String, required: false},
  }, {timestamps: true});

  //these Mongoose functions provide the context for functions i am providing below
  //so "this" refers to either document or model

  userSchema.pre('save', function(){
    if(this.isModified('password')){
      this.password = bcrypt.hashSync(this.password, 10)
    }
  })
  //pre - this property is used to define middleware fun ction that runs before the 'save' is called
  //so it hashes the password before saving it to the database (if it is modified)
  //so even the first time user, it will be as isModified since it is not in the database yet

  userSchema.statics.emailNotExists = async function(email){
    return await this.where(email).countDocuments() === 0;
  }
  //statics - this property is used to define static methods (model methods)
  //so it checks if email exists in the database

  userSchema.methods.checkPasswords = function(password){
    return bcrypt.compareSync(password, this.password);
  } //methods - this property is used to define instance methods (document instance)
  //so it checks plain text pass with the instance's hashed password


const User = mongoose.model("User",userSchema);

export default User;