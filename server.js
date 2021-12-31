const express=require('express');
const app=express();
const ejs=require('ejs');
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const mongoose=require('mongoose');
const session=require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config({path:'./.env'});
const flash=require('connect-flash');
const MongoDbStore=require('connect-mongo');
const { urlencoded } = require('express');
const passport=require('passport');
const Emitter=require('events');
// const Emitter = require('events');
// const { EventEmitter } = require('stream');

const PORT=process.env.PORT ||4000;

//db connectivity
mongoose.connect(process.env.MONGO_CONNECTION_URL)
.then(()=>console.log('db connected'))
.catch(err=>{ console.log('db connection failed')});
const dbConnection=mongoose.connection;

//session store
let mongoStore=  new MongoDbStore({
  mongoUrl:process.env.MONGO_CONNECTION_URL,
  collection:'session'
})

// event emitter

const eventEmitter=new Emitter();
app.set('eventEmitter',eventEmitter);
// const eventEmitter = new events.EventEmitter();
/*const eventEmitter = new Emitter();
app.set('eventEmitter',eventEmitter);*/


// app.use(cookieParser('NotSoSecret'));
//session config
app.use(session({
  secret:process.env.SECRET_KEY,
  store:mongoStore,
  resave:false,
  saveUninitialized:true,
  cookie:{
    maxAge:1000*60*60*24,
    // Secure:true,
    // SameSite: 'None'
  }//24 hours
}))

//passport middlewares
const passportInit=require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//assets
app.use(express.static('public'));

// json & urlEncoded middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//global middleware
app.use((req,res,next)=>{
  res.locals.session=req.session;
  res.locals.user=req.user;
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  next();
})

//set template engine
app.use(expressLayouts);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/resources/views'));





//initiating initRoutes() inside web.js
require('./routes/web')(app);
// 404 page
app.use((req,res)=>{
  res.status(404).send('<h1>404 page not found</h1>');
})

const server=app.listen(PORT,()=>{
    console.log(`server listening at ${PORT}`);
})

// socket connection
  const io=require('socket.io')(server);
  io.on('connection',(socket)=>{

    socket.on('join',roomName=>{

      socket.join(roomName);
    })
  })

  eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data);
  })
  eventEmitter.on('orderPlaced',data=>{
    io.to('adminRoom').emit('orderPlaced',data);
  })









