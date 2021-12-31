const mongoose=require('mongoose');

const menuSchema=new mongoose.Schema({
    name: {type: String, required:true},
    image:{type:String, required:true},
    price:{type:Number, required:true},
    plate:{type:String, required:true},
})
module.exports=new mongoose.model('Menu',menuSchema);
