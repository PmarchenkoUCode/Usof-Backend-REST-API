// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//                  || Path: app.js                                 //
//                                                                  //
// ====================== || Author data || ======================= //
//                                                                  //
//          Code author - Pavlo Marchenko.                          //
//          Email - programmingmarchenko@gmail.com                  //
//          GitHub - https://github.com/PmarchenkoUCode.            //
//                                                                  //
// ================================================================ //

const express = require('express'); // import express
const bodyParser = require('body-parser'); // for parsing the body of the request
const cookieParse = require('cookie-parser'); // for parsing the cookies
const passport = require('passport'); // for authentication
const cors = require('cors'); // for allowing cross-origin requests
const colors = require('colors'); // for colorizing the console output
const mysql = require('mysql2/promise'); // for connecting to the database
const session = require('express-session'); // for session management
const MySQLStore = require('express-mysql-session')(session); // for session management
const fileUpload = require('express-fileupload'); // for uploading files
const morgan = require('morgan'); // for logging requests
const uuid = require('node-uuid'); // for generating unique identifiers
const path = require('path'); // for getting the path of the file
const fs = require('fs');
const app = express(); // create an instance of express

const IN_PROD = process.env.NODE_ENV === 'production'; // check if the application is in production
const port = process.env.PORT || 3000; // set the port to 3000 or the port specified in the environment
const host = process.env.HOST || 'localhost'; // set the host to localhost or the host specified in the environment

morgan.token('id', function getId(req) { // create a custom morgan token for the id of the user
    return req.session.id;
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }); // create a stream for logging the requests

const pool = mysql.createPool({ // create a connection pool to the database
    host        : process.env.DB_HOST || 'localhost',
    port        : process.env.DB_PORT || 3306,
    user        : process.env.DB_USER || 'pmarchenko',
    password    : process.env.DB_PASSWORD || '40tefavi',
    database    : process.env.DB_DATABASE || 'usof'
});

const sessionStore = new MySQLStore({ // create a new MySQLStore instance
    createDatabaseTable: false,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, pool);

app.use(cors()); // for allowing cross-origin requests

app.use(session({
    secret: 'secret',
    key: 'user',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false
    }
})); // for session management

app.use(assingId); // for assinging the id of the user to the session
app.use(morgan(':id :method :url :status :response-time ms')); // for logging requests
app.use(morgan('dev', { stream: accessLogStream })); // for logging requests
app.use(morgan('combined', { stream: accessLogStream })); // for logging requests
app.use(cookieParse()); // For parsing the cookies in the request
app.use(fileUpload()); // For uploading files in the request
app.use(passport.initialize()); // For authentication 
app.use(passport.session()); // for authentication
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public')); // set the public folder as the static folder

app.use('/api/auth', require('./routes/auth')); // for authentication routes
app.use('/api/users', require('./routes/users')); // for users routes
app.use('/api/posts', require('./routes/post')); // for posts routes
app.use('/api/categories', require('./routes/categories')); // for categories routes
// app.use('/api/comments', require('./routes/comments')); // for comments routes

// Session Authentication
app.use(function(req, res, next) {
    if (req.user) { 
        console.log(colors.green(`[${req.user.login}]`), 'is logged in.'); 
        res.locals.user = req.user; 
    }
    console.log(colors.green(`[${req.method}]`), colors.yellow(`[${req.url}]`));
    next();
});

// For handling errors in the application (404, 500, etc.)
app.use((error, req, res, next) => {
    console.log(colors.red(error));
    res.status(error.status || 500).render('error', { 
        msg: 'Please check back later!'
    });
});

// Start the server
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`.green);
    console.log('Press CTRL + C to stop\n'.yellow);
});

// Assign the id of the user to the session
function assingId(req, res, next) {
    req.session.id = uuid.v4();
    next();
}

module.exports = app; // export the app
