import * as userDao from '../dao/user-dao';
import { timingSafeEqual } from 'crypto';

export function createUserTable() {
  return userDao.createUserTable();
}
export function findByUser(user: string){
  return userDao.findByUser(user)
}
export function findAllUsers(){
  return userDao.findAllUser()
}

export function saveUser(user: any){
  return userDao.saveUser(user);
}

export function createUser(){

}
