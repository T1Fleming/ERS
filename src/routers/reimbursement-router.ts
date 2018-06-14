import express, { Response } from 'express';
import * as reimbursementService from '../services/reimbursement-service';
export const reimbursementRouter = express.Router();
import { authMiddleware } from '../security/auth-middleware';
import { EDESTADDRREQ } from 'constants';

reimbursementRouter.get('/status/:status', [
    authMiddleware('admin'),
    (req, resp: Response, next) => {
      reimbursementService.findByStatus(req.params.status)
        .then(data => {
          resp.json(data.Items);
        })
        .catch(err => {
          console.log(err);
          resp.sendStatus(500);
        });
    }
  ]);

  reimbursementRouter.get('/user', [
    authMiddleware('admin', 'employee'),
    (req, resp: Response, next) => {
      //reimbursementService.findReByUser(req.params.user) req.session.username
      reimbursementService.findReByUser(req.session.username)
        .then(data => {
          resp.json(data.Items);
        })
        .catch(err => {
          console.log(err);
          resp.sendStatus(500);
        });
    }
  ]);

  
  reimbursementRouter.get('/:user/:time', [
    authMiddleware('admin'), (req, resp) => {
    reimbursementService.findReByUserTime(req.params.user, parseInt(req.params.time))
      .then(data => {
        resp.json(data.Item);
      })
      .catch(err => {
        resp.sendStatus(500);
      });
  }]);

  reimbursementRouter.get('/:status', [
    authMiddleware('admin', 'employee'), (req, resp) => {
    reimbursementService.findReByUserStatus(req.session.username, req.params.status)
      .then(data => {
        resp.json(data.Items);
      })
      .catch(err => {
        resp.sendStatus(500);
      });
  }]);



  reimbursementRouter.post('/user', [
    authMiddleware('admin', 'employee'),
    (req, resp: Response, next) => {
      //Get and post username 
      let usernami= req.session.username
      var d = new Date();

      let addData ={
        username: usernami,
        timestamp: d.getTime(),
        items: req.body,
        approver: 'n/a',
        status: 'pending'
      }

      reimbursementService.submitReimbursement(addData)
        .then(data => {
          resp.json(data.Items);
        })
        .catch(err => {
          console.log(err);
          resp.sendStatus(500);
        });
    }
  ]);

 reimbursementRouter.put('', [
    authMiddleware('admin'),
    (req, resp: Response, next) => {
      reimbursementService.updateReByUserTime(req.body.username, parseInt(req.body.timestamp), req.body.newStatus, req.session.username)
        .then(data => {
          resp.json(data.Items);
        })
        .catch(err => {
          console.log(err);
          resp.sendStatus(500);
        });
    }
  ]);