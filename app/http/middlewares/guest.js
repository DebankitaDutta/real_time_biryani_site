function guest(req,res,next){

    if(!req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect('/');
    }

}
module.exports=guest