var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials'); //importar la factoria express-partials
var sequelize = require('sequelize');
var methodOverride = require('method-override');
var session = require('express-session');


var routes = require('./routes/index');



var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(partials()); //instalar la factoria express-partials en app


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded());
//app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('Quiz 2015'));
app.use(session());


app.use(function(req, res, next) {


if(!req.path.match(/\/login|\/logout/)) {
req.session.redir = req.path;
}

res.locals.session = req.session;
if (req.session.tiempo){
      var ultimoTiempo = new Date().getTime();
      var intervalo = ultimoTiempo - req.session.tiempo;
      if (intervalo > (2 * 60 * 1000)) {
         delete req.session.tiempo;
        req.session.autoLogout = true;   
         res.redirect("/logout");
      } else {
         req.session.tiempo = ultimoTiempo;
      }
   };

next();
});

app.use('/', routes);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, // print err
		errors: []
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},  
	errors: []
    });
});


module.exports = app;