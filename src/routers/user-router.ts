import express, { Response } from 'express';
import * as userService from '../services/user-service';
export const userRouter = express.Router();
import { authMiddleware } from '../security/auth-middleware';

userRouter.get('/:user', [
    authMiddleware('admin', 'employee'),
    (req, resp: Response, next) => {
      userService.findByUser(req.params.user)
        .then(data => {
          resp.json(data.Items);
        })
        .catch(err => {
          console.log(err);
          resp.sendStatus(500);
        });
    }
  ]);

  userRouter.get('', [
    authMiddleware('admin', 'employee'),
    (req, resp: Response, next) => {
      console.log('sessionid user router: '+req.session.id)
      userService.findAllUsers()
        .then(data => {
          resp.json(data.Items);
        })
        .catch(err => {
          console.log(err);
          resp.sendStatus(500);
        });
    }
  ]);

  userRouter.put('', [
    //authMiddleware('admin', 'employee'),
    (req, resp: Response, next) => {
      userService.saveUser(req.body)
        .then(data => {
          resp.json(data.Items);
        })
        .catch(err => {
          console.log(err);
          resp.sendStatus(500);
        });
    }
  ]);