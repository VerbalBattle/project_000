// Note: comments done with
// http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

//                       _              _ 
//                      (_)            | |
//  _ __ ___  __ _ _   _ _ _ __ ___  __| |
// | '__/ _ \/ _` | | | | | '__/ _ \/ _` |
// | | |  __/ (_| | |_| | | | |  __/ (_| |
// |_|  \___|\__, |\__,_|_|_|  \___|\__,_|
//              | |                       
//              |_|                         

// Requirements
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./db/db_config');
var serverConfig = require('./server/serverConfig');

// Socket requirements
var socket_io = require('socket.io');
// Make express app
var app = express();

// socket
// var io = socket_io();
// app.io = io;

app.io = require('./server/sockets');

io.on("connection", function (socket) {
  console.log("\n" + socket.id, "connected.\n");
  socket.on("client:linkUser", function (data) {
    console.log(data)
  })
  socket.emit('hello', 'hey world');
})

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function (req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}

// Uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// Route reference controllers
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var avatars = require('./routes/avatars');
var rooms = require('./routes/rooms');
var matchmaking = require('./routes/matchmaking');
var wiki = require('./routes/wiki');

// Specify routes
app.use('/', routes);
app.use('/users', users);
app.use('/avatars', avatars);
app.use('/rooms', rooms);
app.use('/matchmaking', matchmaking);
app.use('/wiki', wiki);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//   ___ _ __ _ __ ___  _ __ ___ 
//  / _ \ '__| '__/ _ \| '__/ __|
// |  __/ |  | | | (_) | |  \__ \
//  \___|_|  |_|  \___/|_|  |___/

// Development error handler
// Will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// Production error handler
// (No stacktraces leaked to user)
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

//                             _       
//                            | |      
//   _____  ___ __   ___  _ __| |_ ___ 
//  / _ \ \/ / '_ \ / _ \| '__| __/ __|
// |  __/>  <| |_) | (_) | |  | |_\__ \
//  \___/_/\_\ .__/ \___/|_|   \__|___/
//           | |                       
//           |_|                       

// Export application
module.exports = app;
