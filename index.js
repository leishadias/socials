const express = require('express');
const env = require('./config/environment');
const logger=require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view_helpers')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');  

const flash= require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');


//sass middleware - no longer available
// const sassMiddleware = require('sass-middleware')
// app.use(sassMiddleware({
//   src: './assets/scss',
//   dest:'./assets/css',
//   debug: true,
//   outputStyle: 'extended',
//   prefix: '/css'
// }));

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(__dirname + env.asset_path));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));
app.use(expressLayouts);
//extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(
    session({
      name: 'codial',
      secret: env.session_cookie_key,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 100,
      },
      store: new MongoStore({
        mongoUrl: 'mongodb://127.0.0.1:27017/codial_dev',
        mongooseConnection: db,
        autoRemove: 'disabled',
      }),
    })
  );



app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use('/', require('./routes'));
app.listen(port, function(err){
    if (err){
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`Server set at port: ${port}`);
});

