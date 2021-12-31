const homeControllers = require('../app/http/controllers/homeControllers');
const authControllers = require('../app/http/controllers/authControllers');
const cartControllers=require('../app/http/controllers/cartController');
const guest=require('../app/http/middlewares/guest');
const orderControllers=require('../app/http/controllers/orderController');
const auth=require('../app/http/middlewares/auth');
const adminControllers=require('../app/http/controllers/admin/adminOrderControllers');
const adminAuth=require('../app/http/middlewares/adminAuth');
const statusController=require('../app/http/controllers/admin/statusController');

function initRoutes(app) {

    app.get('/', homeControllers().index)

    app.get('/login',guest, authControllers().login);
    app.post('/login', authControllers().postLogin);

    app.get('/register',guest, authControllers().register)
    app.post('/register', authControllers().postRegister)

    app.post('/logout', authControllers().logout);

    app.get('/cart',cartControllers().index);
    app.post('/update-cart',cartControllers().update);
 
    //customer routes
    app.get('/customer/orders',auth,orderControllers().index)
    app.post('/orders',orderControllers().store);
    app.get('/customer/orders/:id',orderControllers().show)

    //admin routes
    app.get('/admin/orders',adminAuth,adminControllers().index)
    app.post('/admin/order/status',adminAuth,statusController().update)
}
module.exports = initRoutes;