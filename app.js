var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//https://github.com/node-schedule/node-schedule
var schedule = require('node-schedule');
var request = require('request')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//vue
app.use(express.static(path.join(__dirname, './public/dist')))

app.use(session({
    key: 'ytchar.sess',
    secret: 'keyboard cat',
    proxy: true,
    resave: true,
    saveUninitialized: true
}))


//将 views 加入根目录
app.use(express.static(path.join(__dirname, "views")));

//domain
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    if(req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});




//-------------建立全局变量---------------
global["ctx"] = {};
global["dispatchs"] = {};
let appRootDir = require('app-root-dir').get();
app.set('tps', ['loopback', 'linklocal', 'uniquelocal'])
global.ctx.root = appRootDir.replace(/\\/g,"/")+"/";
//--------------------------------------

//---------------------------
// 启动动作
let init = require("./inits/init");
init.init(app)





//---------------------------

module.exports = app;
