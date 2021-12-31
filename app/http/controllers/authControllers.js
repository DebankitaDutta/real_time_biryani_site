const User=require('../../models/user');
const bcrypt=require('bcrypt');
const passport=require('passport');
const authControllers=function(){
    function _getRedirect(req){
       return  req.user.role==='admin'? '/admin/orders':'/customer/orders';
    }

    return{
        login(req,res){
            res.render('auth/login');
            // console.log('inside get login');
        },
        postLogin(req,res,next){
            const{email,password}=req.body;
            if(!email ||!password){
                req.flash('error_msg','please fill in all the fields');
                res.redirect('/login');
            }
            else{

                passport.authenticate('local',(err,user,info)=>{
                        
                    if(err){
                        req.flash('error_msg',info.message);
                        return next(err);
                    }
                    if(!user){
                        req.flash('error_msg',info.message);
                        return res.redirect('/login');
                    }
                    req.logIn(user,(err)=>{
                        if(err){
                            req.flash('error_msg',info.msg);
                            return next(err);
                        }
                        else{
                            // req.flash('success_msg',info.message);
                            return res.redirect(_getRedirect(req));
                        }
                    })
                })(req,res,next);
            }
        },
        register(req,res){
            res.render('auth/register');
        },
        postRegister(req,res){
            const{name,email,password,password2}=req.body;
            let errors=[];
            //validation checking
            //if all the fields are not filled
            if(!name || !email||!password || !password2)
            {
                errors.push({msg:'all fields are required!'})
            }
            //if password is shorter
            if(password.length<5){
                errors.push({msg:'password length should be more than 5'})
            }

            //if password isn't matching
            if(password!=password2){
                errors.push({msg:'passwords are not matching'})
            }
            if(errors.length>0){
                res.render('auth/register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }
            else{

                //if emailid already exists
                User.exists({email : email},(err,result)=>{
                    if(result){
                        errors.push({'msg':'email id already existes'});
                        res.render('auth/register',{
                            name,
                            email,
                            errors
                        });
                    }
                    else{

                        //create user if all validation passed
                        const user=new User({
                            name,
                            email,
                            password,
                            password2
                        })

                        //create hashPassword
                        bcrypt.genSalt(10,(err,salt)=>{
                            bcrypt.hash(user.password,salt,(err,hash)=>{
                                if(err) throw err;

                                 //setting the hashed password
                                user.password=hash;

                                 //now saving the user to the db
                                    user.save()
                                    .then(newUser=>{
                                        req.flash('success_msg','registered successfully')
                                        res.redirect('/login')
                                    })
                                    .catch(error=>{
                                        req.flash('error_msg','something went wrong')
                                        res.redirect('/register')
                                        console.log(error);
                                    })
                            })
                        })
            
                    }
                })
            }

            
        },
        logout(req,res){
            req.logout();
            res.redirect('/');
        }
        
    }
}
module.exports=authControllers;