const Order=require('../../../models/orders')

function orderControllers(){

    return{

        index(req,res){
            // console.log('inside orderControllers');
            Order.find({'orderStatus': { $ne : 'completed' }},null,{ sort:{
                'createdAt':-1
            }}).populate('customerId','-password').exec((err,orders)=>{
                if(req.xhr){
                    return res.json(orders);
                }
                return res.render('admin/orders');
            })
        }
 
    }
}
module.exports=orderControllers