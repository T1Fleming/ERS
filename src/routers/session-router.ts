import express from 'express';
import { authMiddleware } from '../security/auth-middleware';
export const sessionRouter = express.Router();
import * as userService from '../services/user-service'; // Should probably change it to import one function

/**
 * This route expects an object with a usename and password. If the username and password is recognized it will set a role attribute on
 * the current session so that the role can be viewed upon future requests.
 */
sessionRouter.post('/login', (req, resp, next) => {
  const session = req.body && req.body; //Da fook dis do

  req.session.username = req.body.username

  userService.findByUser(req.body.username).then(data => {

    let userInfo = {
      username: '',
      password: '',
      fName: '',
      role: '',
    }
    userInfo.username = data.Items[0].username
    userInfo.password = data.Items[0].password
    userInfo.fName = data.Items[0].firstName
    userInfo.role= data.Items[0].role
    req.session.role = data.Items[0].role
    console.log(data)

    if (req.body.username === userInfo.username && req.body.password === userInfo.password) {
      //req.session.role = 'admin';
      console.log("Congradulations! Permissions are:" + req.session.role)
      resp.json({
        username: req.body.usename,
        fName: userInfo.fName,
        role: req.session.role
      });
    } else {
      resp.sendStatus(401);
    }
  }).catch(err => {
    console.log(err);
    resp.sendStatus(500);
  });
  // console.log(userInfo)
  //console.log("Retrieved Info:" + userInfo.username+" and "+userInfo.password)
});

/**
 * This will reset the session so that all session data is removed and a new session id will be created
 */
sessionRouter.delete('/logout', (req, resp, next) => {
  req.session.regenerate(err => {
    if (err) {
      resp.sendStatus(500);
    } else {
      resp.end();
    }
  });
});
