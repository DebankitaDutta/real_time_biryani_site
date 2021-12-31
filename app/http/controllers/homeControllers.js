const Menu=require('../../models/menus');

const homeControllers=function(){
    return{
         index:async function(req,res){
               const biryaniMenus=await Menu.find()
                    // console.log(biryaniMenus);
                    res.render('home',{biryaniMenus:biryaniMenus})
            }
    }
}
module.exports=homeControllers;