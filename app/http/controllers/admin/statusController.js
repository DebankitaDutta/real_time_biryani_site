const Order=require('../../../models/orders');

function statusController(){
    return{
        update(req,res){
            Order.updateOne({_id: req.body.orderId},{$set:{orderStatus :req.body.status}},(err,data)=>{
                if(err){
                    req.flash('error_msg',"update isn't successful");
                    return res.redirect('/admin/orders');
                }

                //Emit event

                const eventEmitter=req.app.get('eventEmitter');
                eventEmitter.emit('orderUpdated',{id: req.body.orderId ,orderStatus: req.body.status});
                return res.redirect('/admin/orders');
            })
                
        }
    }
}

module.exports=statusController