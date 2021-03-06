var path = require('path');
var express = require('express');
var config = require('config-lite')(__dirname);
var winston = require('winston');
var expressWinston = require('express-winston');


var pathPublic = path.join(__dirname,'public');
var pathLib = path.join(__dirname,'libs');
var pathConfig= path.join(__dirname,'config');

var routes = require(path.join(__dirname,'routes'));
var projectGet = require(path.join(pathLib,'projectGet.js'));
var index_info = require(path.join(pathPublic,'config','index_info.js'));
var pathProjectGet = [];

var app = express();

//set view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//set index_info
app.locals.index_info = index_info;

//add public
app.use(express.static(pathPublic));
//add img path
app.use('/'+config.pathProjectsImg,express.static(path.join(pathPublic,config.pathProjectsImg)));
//add projects path
config.pathProjectsFind.forEach(function(element) {
    var pathPro = path.join(pathPublic,config.pathProjectsBasic,element);
    app.use('/'+config.pathProjectsBasic,express.static(pathPro));
    pathProjectGet.push(pathPro);
}, this);
//make project's list
app.locals.prList = projectGet(pathProjectGet,path.join(pathPublic,config.pathProjectsInfo));


// log expressWinston
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));
routes(app,pathLib);


app.listen(config.port,function(){
    console.log(`${config.name} listening on port ${config.port}`);

})