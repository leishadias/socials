const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');  

const flash= require('connect-flash');
const customMware = require('./config/middleware');

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
app.use(express.static('./assets'));

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
      secret: 'blahblah',
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

