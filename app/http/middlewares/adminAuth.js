function adminAuth(req,res,next){

    if(req.isAuthenticated() && req.user.role==='admin'){
        // console.log('inside adminauth');
        return next();
    }
    return res.redirect('/');
}

module.exports=adminAuth

