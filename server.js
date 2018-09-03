"use strict";
//estalish connection to mongoDB
require('./api/data/dbConnection');
//require all required packages
const express            = require("express");
const secure             = require('express-force-https');
//initialize express app
const app                = express();
const compression        = require('compression');
const bodyParser         = require('body-parser');
const sanitizer          = require('express-sanitizer');
const methodOverRide     = require('method-override');
const cookieParser       = require('cookie-parser');
const session            = require('express-session');
const mongoStore         = require('connect-mongo')(session);
const helmet             = require('helmet');
const csrf               = require('csurf');
const flash              = require('express-flash');
const mongoose           = require('mongoose');
const passport           = require('passport');
var   moment             = require('moment');
const morgan             = require('morgan');
const path               = require('path');
const httpServer         = require('http').Server(app);
const io                 = require('socket.io')(httpServer);
const socketEvents       = require('./api/data/socketEvents')(io, app);
const ejs                = require('ejs');
const engine             = require('ejs-mate');
const favicon            = require('serve-favicon');
//Models
const Service            = require('./models/service');
const User               = require('./models/user');
const Cart               = require('./models/cart');
const Tyre               = require('./models/tyre');
const Order              = require('./models/order');
const Calendar           = require('./models/calendar');
//Client routes
//Require routes here
const indexRoutes        = require('./api/client/routes/index');
const authRoutes         = require('./api/client/routes/auth');
const tyreHotelRoutes    = require('./api/client/routes/tyrehotel');
const tyreServiceRoutes  = require('./api/client/routes/tyreservices');
const tyreRoutes         = require('./api/client/routes/tyres');
const bookingRoutes      = require('./api/client/routes/booking');
const priceListRoutes    = require('./api/client/routes/pricelist');
//Admin routes
const adminRoutes        = require('./api/admin/routes/');
const adminOrdersRoutes  = require('./api/admin/routes/orders');
const adminProductRoutes = require('./api/admin/routes/products');
const serviceRoutes      = require('./api/admin/routes/service');
const calendarRoutes     = require('./api/admin/routes/calendar');
/*Setup View engine*/
//REDIRECT www.domain.com TO domain.com
if(process.env.NODE_ENV === 'production') {
  app.use(secure);
}
app.use(compression());
app.use(helmet());
app.engine('ejs', engine);
app.set('view-engine', 'ejs');
//set port and ip
app.set("port", process.env.PORT || 3000);
app.set("ip", process.env.IP || "0.0.0.0");
//Headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  if ('OPTIONS' == req.method) {
     res.sendStatus(200);
  } else {
     next();
  }
});
//Set up static folder
app.use(express.static(path.join(__dirname + "/public")));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//Setup app packages and middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(sanitizer());
app.use(methodOverRide("_method"));
app.use(cookieParser(process.env.KRYPTO_KEY));
//Session setup
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({ mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 360 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(csrf({ cookie: { signed: true } }));
// You can set morgan to log differently depending on your environment
if (app.get('env') == 'Websiteion') {
  app.use(morgan('common', { skip: function(req, res) {
    return res.statusCode < 400 }, stream: __dirname + '/../morgan.log'}));
} else {
  app.use(morgan('dev'));
}
//Set sendmail ServerData
// app.use((req, res, next) => {
//   var SetServerData = require("./api/data/sendMail");
//   SetServerData.setServerdata(req, res, next);
//   next();
// });
//Pass Cart object to the session
app.use((req, res, next) => {
 if(req.session.cart) {
  next();
 } if(!req.session.cart || req.session.cart === null){
  var cart = new Cart();
  cart.expires = Date.now() + 86400000; /* 24 huors */
  cart.save((err, newCart)=> {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    } else {
      req.session.cart = newCart;
      next();
    }
  });
 }
});
require("moment/min/locales.min");
moment.locale('fi');
app.locals.moment = moment;
//Local variables
app.use(function(req, res, next) {
  res.cookie('_csrfToken', req.csrfToken());
  res.locals.session = req.session;
  res.locals.cart = req.session.cart;
  res.locals.user = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});
var times = [
{
  day: "2018-09-03",
  time: "07:00"
},
{
  day: "2018-09-03",
  time: "08:00"
},
{
  day: "2018-09-03",
  time: "09:00"
},
{
  day: "2018-09-03",
  time: "10:00"
},
{
  day: "2018-09-03",
  time: "11:00"
},
{
  day: "2018-09-03",
  time: "12:00"
},
{
  day: "2018-09-03",
  time: "13:00"
},
{
  day: "2018-09-03",
  time: "14:00"
},
{
  day: "2018-09-03",
  time: "15:00"
},
{
  day: "2018-09-03",
  time: "16:00"
},
{
  day: "2018-09-03",
  time: "17:00"
},
{
  day: "2018-09-04",
  time: "07:00"
},
{
  day: "2018-09-04",
  time: "08:00"
},
{
  day: "2018-09-04",
  time: "09:00"
},
{
  day: "2018-09-04",
  time: "10:00"
},
{
  day: "2018-09-04",
  time: "11:00"
},
{
  day: "2018-09-04",
  time: "12:00"
},
{
  day: "2018-09-04",
  time: "13:00"
},
{
  day: "2018-09-04",
  time: "14:00"
},
{
  day: "2018-09-04",
  time: "15:00"
},
{
  day: "2018-09-04",
  time: "16:00"
},
{
  day: "2018-09-04",
  time: "17:00"
},
{
  day: "2018-09-05",
  time: "07:00"
},
{
  day: "2018-09-05",
  time: "08:00"
},
{
  day: "2018-09-05",
  time: "09:00"
},
{
  day: "2018-09-05",
  time: "10:00"
},
{
  day: "2018-09-05",
  time: "11:00"
},
{
  day: "2018-09-05",
  time: "12:00"
},
{
  day: "2018-09-05",
  time: "13:00"
},
{
  day: "2018-09-05",
  time: "14:00"
},
{
  day: "2018-09-05",
  time: "15:00"
},
{
  day: "2018-09-05",
  time: "16:00"
},
{
  day: "2018-09-05",
  time: "17:00"
},
{
  day: "2018-09-06",
  time: "07:00"
},
{
  day: "2018-09-06",
  time: "08:00"
},
{
  day: "2018-09-06",
  time: "09:00"
},
{
  day: "2018-09-06",
  time: "10:00"
},
{
  day: "2018-09-06",
  time: "11:00"
},
{
  day: "2018-09-06",
  time: "12:00"
},
{
  day: "2018-09-06",
  time: "13:00"
},
{
  day: "2018-09-06",
  time: "14:00"
},
{
  day: "2018-09-06",
  time: "15:00"
},
{
  day: "2018-09-06",
  time: "16:00"
},
{
  day: "2018-09-06",
  time: "17:00"
},
{
  day: "2018-09-07",
  time: "07:00"
},
{
  day: "2018-09-07",
  time: "08:00"
},
{
  day: "2018-09-07",
  time: "09:00"
},
{
  day: "2018-09-07",
  time: "10:00"
},
{
  day: "2018-09-07",
  time: "11:00"
},
{
  day: "2018-09-07",
  time: "12:00"
},
{
  day: "2018-09-07",
  time: "13:00"
},
{
  day: "2018-09-07",
  time: "14:00"
},
{
  day: "2018-09-07",
  time: "15:00"
},
{
  day: "2018-09-07",
  time: "16:00"
},
{
  day: "2018-09-07",
  time: "17:00"
},
{
  day: "2018-09-08",
  time: "07:00"
},
{
  day: "2018-09-08",
  time: "08:00"
},
{
  day: "2018-09-08",
  time: "09:00"
},
{
  day: "2018-09-08",
  time: "10:00"
},
{
  day: "2018-09-08",
  time: "11:00"
},
{
  day: "2018-09-08",
  time: "12:00"
},
{
  day: "2018-09-08",
  time: "13:00"
},
{
  day: "2018-09-08",
  time: "14:00"
},
{
  day: "2018-09-08",
  time: "15:00"
},
{
  day: "2018-09-08",
  time: "16:00"
},
{
  day: "2018-09-08",
  time: "17:00"
},
{
  day: "2018-09-09",
  time: "07:00"
},
{
  day: "2018-09-09",
  time: "08:00"
},
{
  day: "2018-09-09",
  time: "09:00"
},
{
  day: "2018-09-09",
  time: "10:00"
},
{
  day: "2018-09-09",
  time: "11:00"
},
{
  day: "2018-09-09",
  time: "12:00"
},
{
  day: "2018-09-09",
  time: "13:00"
},
{
  day: "2018-09-09",
  time: "14:00"
},
{
  day: "2018-09-09",
  time: "15:00"
},
{
  day: "2018-09-09",
  time: "16:00"
},
{
  day: "2018-09-09",
  time: "17:00"
},
{
  day: "2018-09-10",
  time: "07:00"
},
{
  day: "2018-09-10",
  time: "08:00"
},
{
  day: "2018-09-10",
  time: "09:00"
},
{
  day: "2018-09-10",
  time: "10:00"
},
{
  day: "2018-09-10",
  time: "11:00"
},
{
  day: "2018-09-10",
  time: "12:00"
},
{
  day: "2018-09-10",
  time: "13:00"
},
{
  day: "2018-09-10",
  time: "14:00"
},
{
  day: "2018-09-10",
  time: "15:00"
},
{
  day: "2018-09-10",
  time: "16:00"
},
{
  day: "2018-09-10",
  time: "17:00"
},
{
  day: "2018-09-11",
  time: "07:00"
},
{
  day: "2018-09-11",
  time: "08:00"
},
{
  day: "2018-09-11",
  time: "09:00"
},
{
  day: "2018-09-11",
  time: "10:00"
},
{
  day: "2018-09-11",
  time: "11:00"
},
{
  day: "2018-09-11",
  time: "12:00"
},
{
  day: "2018-09-11",
  time: "13:00"
},
{
  day: "2018-09-11",
  time: "14:00"
},
{
  day: "2018-09-11",
  time: "15:00"
},
{
  day: "2018-09-11",
  time: "16:00"
},
{
  day: "2018-09-11",
  time: "17:00"
},
{
  day: "2018-09-12",
  time: "07:00"
},
{
  day: "2018-09-12",
  time: "08:00"
},
{
  day: "2018-09-12",
  time: "09:00"
},
{
  day: "2018-09-12",
  time: "10:00"
},
{
  day: "2018-09-12",
  time: "11:00"
},
{
  day: "2018-09-12",
  time: "12:00"
},
{
  day: "2018-09-12",
  time: "13:00"
},
{
  day: "2018-09-12",
  time: "14:00"
},
{
  day: "2018-09-12",
  time: "15:00"
},
{
  day: "2018-09-12",
  time: "16:00"
},
{
  day: "2018-09-12",
  time: "17:00"
},
{
  day: "2018-09-13",
  time: "07:00"
},
{
  day: "2018-09-13",
  time: "08:00"
},
{
  day: "2018-09-13",
  time: "09:00"
},
{
  day: "2018-09-13",
  time: "10:00"
},
{
  day: "2018-09-13",
  time: "11:00"
},
{
  day: "2018-09-13",
  time: "12:00"
},
{
  day: "2018-09-13",
  time: "13:00"
},
{
  day: "2018-09-13",
  time: "14:00"
},
{
  day: "2018-09-13",
  time: "15:00"
},
{
  day: "2018-09-13",
  time: "16:00"
},
{
  day: "2018-09-13",
  time: "17:00"
},
{
  day: "2018-09-14",
  time: "07:00"
},
{
  day: "2018-09-14",
  time: "08:00"
},
{
  day: "2018-09-14",
  time: "09:00"
},
{
  day: "2018-09-14",
  time: "10:00"
},
{
  day: "2018-09-14",
  time: "11:00"
},
{
  day: "2018-09-14",
  time: "12:00"
},
{
  day: "2018-09-14",
  time: "13:00"
},
{
  day: "2018-09-14",
  time: "14:00"
},
{
  day: "2018-09-14",
  time: "15:00"
},
{
  day: "2018-09-14",
  time: "16:00"
},
{
  day: "2018-09-14",
  time: "17:00"
},
{
  day: "2018-09-15",
  time: "07:00"
},
{
  day: "2018-09-15",
  time: "08:00"
},
{
  day: "2018-09-15",
  time: "09:00"
},
{
  day: "2018-09-15",
  time: "10:00"
},
{
  day: "2018-09-15",
  time: "11:00"
},
{
  day: "2018-09-15",
  time: "12:00"
},
{
  day: "2018-09-15",
  time: "13:00"
},
{
  day: "2018-09-15",
  time: "14:00"
},
{
  day: "2018-09-15",
  time: "15:00"
},
{
  day: "2018-09-15",
  time: "16:00"
},
{
  day: "2018-09-15",
  time: "17:00"
},
{
  day: "2018-09-16",
  time: "07:00"
},
{
  day: "2018-09-16",
  time: "08:00"
},
{
  day: "2018-09-16",
  time: "09:00"
},
{
  day: "2018-09-16",
  time: "10:00"
},
{
  day: "2018-09-16",
  time: "11:00"
},
{
  day: "2018-09-16",
  time: "12:00"
},
{
  day: "2018-09-16",
  time: "13:00"
},
{
  day: "2018-09-16",
  time: "14:00"
},
{
  day: "2018-09-16",
  time: "15:00"
},
{
  day: "2018-09-16",
  time: "16:00"
},
{
  day: "2018-09-16",
  time: "17:00"
},
{
  day: "2018-09-17",
  time: "07:00"
},
{
  day: "2018-09-17",
  time: "08:00"
},
{
  day: "2018-09-17",
  time: "09:00"
},
{
  day: "2018-09-17",
  time: "10:00"
},
{
  day: "2018-09-17",
  time: "11:00"
},
{
  day: "2018-09-17",
  time: "12:00"
},
{
  day: "2018-09-17",
  time: "13:00"
},
{
  day: "2018-09-17",
  time: "14:00"
},
{
  day: "2018-09-17",
  time: "15:00"
},
{
  day: "2018-09-17",
  time: "16:00"
},
{
  day: "2018-09-17",
  time: "17:00"
},{
  day: "2018-09-18",
  time: "07:00"
},
{
  day: "2018-09-18",
  time: "08:00"
},
{
  day: "2018-09-18",
  time: "09:00"
},
{
  day: "2018-09-18",
  time: "10:00"
},
{
  day: "2018-09-18",
  time: "11:00"
},
{
  day: "2018-09-18",
  time: "12:00"
},
{
  day: "2018-09-18",
  time: "13:00"
},
{
  day: "2018-09-18",
  time: "14:00"
},
{
  day: "2018-09-18",
  time: "15:00"
},
{
  day: "2018-09-18",
  time: "16:00"
},
{
  day: "2018-09-18",
  time: "17:00"
},
{
  day: "2018-09-19",
  time: "07:00"
},
{
  day: "2018-09-19",
  time: "08:00"
},
{
  day: "2018-09-19",
  time: "09:00"
},
{
  day: "2018-09-19",
  time: "10:00"
},
{
  day: "2018-09-19",
  time: "11:00"
},
{
  day: "2018-09-19",
  time: "12:00"
},
{
  day: "2018-09-19",
  time: "13:00"
},
{
  day: "2018-09-19",
  time: "14:00"
},
{
  day: "2018-09-19",
  time: "15:00"
},
{
  day: "2018-09-19",
  time: "16:00"
},
{
  day: "2018-09-19",
  time: "17:00"
},
{
  day: "2018-09-20",
  time: "07:00"
},
{
  day: "2018-09-20",
  time: "08:00"
},
{
  day: "2018-09-20",
  time: "09:00"
},
{
  day: "2018-09-20",
  time: "10:00"
},
{
  day: "2018-09-20",
  time: "11:00"
},
{
  day: "2018-09-20",
  time: "12:00"
},
{
  day: "2018-09-20",
  time: "13:00"
},
{
  day: "2018-09-20",
  time: "14:00"
},
{
  day: "2018-09-20",
  time: "15:00"
},
{
  day: "2018-09-20",
  time: "16:00"
},
{
  day: "2018-09-20",
  time: "17:00"
},
{
  day: "2018-09-21",
  time: "07:00"
},
{
  day: "2018-09-21",
  time: "08:00"
},
{
  day: "2018-09-21",
  time: "09:00"
},
{
  day: "2018-09-21",
  time: "10:00"
},
{
  day: "2018-09-21",
  time: "11:00"
},
{
  day: "2018-09-21",
  time: "12:00"
},
{
  day: "2018-09-21",
  time: "13:00"
},
{
  day: "2018-09-21",
  time: "14:00"
},
{
  day: "2018-09-21",
  time: "15:00"
},
{
  day: "2018-09-21",
  time: "16:00"
},
{
  day: "2018-09-21",
  time: "17:00"
},
];
for(var i = 0; i < times.length; i++) {
  Calendar.create(times[i], (err, newTime) => {
    if(err) {
      return req.flash("error", err.message);
      res.redirect("/");
    } else {
      console.log(newTime);
    }
  });
}
// client routes
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/renkaat", tyreRoutes);
app.use("/rengashotelli", tyreHotelRoutes);
app.use('/rengaspalvelut', tyreServiceRoutes);
app.use("/ajanvaraus", bookingRoutes);
app.use("/hinnasto", priceListRoutes);
// admin routes
app.use("/admin", adminRoutes);
app.use("/admin/orders", adminOrdersRoutes);
app.use("/admin/products", adminProductRoutes);
app.use("/admin/services", serviceRoutes);
app.use("/admin/calendar", calendarRoutes);
app.get("*", function(req,res, next) {
  res.sendFile(__dirname"/public/404_notfound.html");
});
//Start server
let server = httpServer.listen(app.get("port"), app.get('ip'), (err) => {
  if(err) {
    res.status(500).send(err+"Ups! Palvelinta ei voitu käynnistää, teknisen vian vuoksi.");
  } else {
    let port = server.address().port;
    console.log("Klaukkalan rengas on startattu palvelimella: "+port);
  }
});