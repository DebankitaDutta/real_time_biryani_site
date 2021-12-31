const Order=require('../../models/orders');
const moment=require('moment');
function orderControllers(){


    return{

        store(req,res){
            // console.log(req.body);
            const {phonenumber,address}=req.body;
            if(!phonenumber || !address){
                req.flash('error_msg','please fill in all the fields');
            return res.redirect('/cart');
            }
            
            const order=new Order({
                customerId : req.user._id,
                items : req.session.cart.items,
                phonenumber,
                address
            })
            // console.log(order);
            order.save().then(result=>{
                Order.populate(result,{path: 'customerId'},(err,placedOrder)=>{

                    req.flash('success_msg','order placed successfully')
                    delete req.session.cart;
    
                    //emit event
                    const eventEmitter=req.app.get('eventEmitter');
                    eventEmitter.emit('orderPlaced',placedOrder);
    
                    return res.redirect('/customer/orders');
                })

            }).catch(error=>{
                req.flash('error_msg','somethimg went wrong')
            return res.redirect('/cart');
            })
            
        },
        async index(req,res){
            const orders=await Order.find({cutomerId: req.user._id},null,{ 
                sort:{
                    'createdAt':-1
                }
            });
            
            res.header('Cache-Control', 'no-store,no-cache')

            res.render('customers/orders',{orders,moment});
        },
        async show(req,res){
            const order=await Order.findById(req.params.id);
            //authorized user
            if(req.user._id.toString()===order.customerId.toString()){
               return res.render('customers/singleOrder',{order});
            }
            return res.render('/');
        }
    }
}
module.exports=orderControllers;