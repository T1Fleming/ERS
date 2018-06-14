import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import { userRouter } from './routers/user-router';
import { reimbursementRouter } from './routers/reimbursement-router';
import { sessionRouter } from './routers/session-router';
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 3000;
app.set('port', port);

const sess = {
  secret: 'keyboard cat',
  cookie: {secure:false},
  resave: false,
  saveUninitialized: false,
}

// const sess = {
//   secret: 'justsomestuff',
//   resave: false,
//   saveUninitialized: false,
//   expires: new Date(Date.now() + (60 * 60 * 24 * 7 * 1000)),
//   cookie: {  } ,
//   store: new MongoStore({mongooseConnection: mongoose.connection})
// }


// set up express to attach sessions
app.use(session(sess));

// allow static content to be served, navigating to url with nothing after / will serve index.html from public
app.use(
  express.static(path.join(__dirname, './static'))
);
// log the request being made
app.use((req, res, next) => {
  console.log(`request made with path: ${req.path} \nand type: ${req.method}`);
  next();
});

// use the body parser to convert request json
app.use(bodyParser.json());

// allow cross orgins
app.use((req, resp, next)=> {
  resp.header('Access-Control-Allow-Origin','http://localhost:3000');
  resp.header("Access-Control-Allow-Credentials, true");
  resp.header('Access-Control-Allow-Credentials', 'true');
  resp.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

/*******************************************************************************
 * ROUTERS
 *******************************************************************************/
app.use('/users', userRouter);
app.use('/reimbursement', reimbursementRouter);
app.use('/auth',sessionRouter)

// start up the app
app.listen(port, () => {
  console.log(`App is running at http://localhost:${app.get('port')}`);
});