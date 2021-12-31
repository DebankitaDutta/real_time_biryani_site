const LocalStratagy=require('passport-local').Strategy;
const bcrypt=require('bcrypt');
const User=require('../models/user');
function passportInit(passport){

    passport.use(new LocalStratagy({usernameField:'email'},async(email,password,done)=>{
        const user=await User.findOne({email:email})
         if(!user){
            return done(null,false,{message: "mail id doesn't exist"})
         }
         else{
             bcrypt.compare(password,user.password).then(isMatch=>{
                if(isMatch)
                    return done(null,user,{message: 'logged in successfully'});
                 else
                 return done(null,false,{message: 'oops!! incorrect password'});
             })
             .catch(err=>{
                return done(null,false,{message: 'something went wrong'});
             })
         }
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id);
    })

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user);
        })
    })


}

module.exports=passportInit;