function cartControllers(){
    return{
        index:(req,res)=>{
            res.render('customers/cart');
        },
        update:(req,res)=>{

            // cart object structure
            // let cart={
            //     items:{
                    //  itemObjectId:{item:itemObject,qty:0},

                    //  totalQty:0,
                    //  totalAmount:0
            //     }
            // }

            if(!req.session.cart){
                req.session.cart={
                    items:{},
                    totalAmount:0,
                    totalQty:0
                }
            }
            let cart=req.session.cart;
            if(!cart.items[req.body._id]){
                cart.items[req.body._id]={
                    item:req.body,
                    qty:1
                }
                cart.totalQty+=1;
                cart.totalAmount+=req.body.price;
            }
            else{
                cart.items[req.body._id].qty+=1;
                cart.totalQty+=1;
                cart.totalAmount+=req.body.price;
            }

            return res.json({totalQty:req.session.cart.totalQty});
        }
    }
}
module.exports=cartControllers;