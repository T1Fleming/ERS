import * as reimbursementDao from '../dao/reimbursement-dao';
import { timingSafeEqual } from 'crypto';

export function findReByUsername(){
  
}

export function findByStatus(status: string){
    return reimbursementDao.findByStatus(status);
}

export function findReByUser(user: string){
    return reimbursementDao.findReByUser(user);
}

export function submitReimbursement(reimbursement){
    return reimbursementDao.submitReimbursement(reimbursement);
}

export function findReByUserTime(user: string, time: number){
    return reimbursementDao.findReByUserTime(user, time);
}

export function updateReByUserTime(user: string, time: number, newStatus: string, approver: string){
    return reimbursementDao.updateReByUserTime(user, time, newStatus,approver)
}

export function findReByUserStatus(user: string, status: string){
    return reimbursementDao.findReByUserStatus(user, status)
}