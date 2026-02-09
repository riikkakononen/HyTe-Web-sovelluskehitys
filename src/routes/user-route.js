import express from 'express';
import {getUsers, postLogin, postUser, getUserById, putUserById, deleteUserById} from '../controllers/user-controller.js';

const userRouter = express.Router();

// Users resource endpoints
userRouter.route('/')
// GET all users
.get(getUsers)
// POST new user
.post(postUser);

// POST user login
userRouter.post('/login', postLogin)

    // TODO: get user by id
    .get('getUserById')
    // TODO: put user by id
    .put('putUserById')
    // TODO: delete user by id
    .delete('deleteUserById');

export default userRouter;