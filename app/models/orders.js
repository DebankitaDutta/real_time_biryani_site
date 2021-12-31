const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    customerId:{
                type : mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
    },
    items:{type: Object,required:true},
    phonenumber:{type:String,required:true},
    address:{type:String, required:true},
    paymentType:{type:String, default:'COD'},
    orderStatus:{type:String,default:'order placed'}
},{timestamps:true})

module.exports=mongoose.model('Order',orderSchema);