var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const http = require("http");

const mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registration = require('./routes/registration');
var routeRouter = require('./routes/route');
const PassengerCount = require("./model/PassengerCountSchema");

var app = express();
const server = http.createServer(app);
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


// ✅ Stable MongoDB Connection
const uri = 'mongodb+srv://karthik:Karthik%400756@cluster0.zxheq.mongodb.net/Atlas';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch(err => console.error('MongoDB Connection Error:', err));

// ✅ Middlewares

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/registration', registration);
app.use('/route', routeRouter);

// ✅ Socket.io Integration


// ✅ Error Handling
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// ✅ Check If Server Works



// ✅ Start Server


module.exports = app;
