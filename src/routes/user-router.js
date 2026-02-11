import express from 'express';
import {getUsers, postLogin, postUser, getUserById, putUserById, deleteUser} from '../controllers/user-controller.js';

const userRouter = express.Router();

// Users resource endpoints
userRouter.route('/')
    // GET all users
    .get(getUsers)
    // POST new user
    .post(postUser);

// POST user login
userRouter.post('/login', postLogin);

userRouter.route('/:id')
    // : get user by id
    .get(getUserById)
    // DONE: put user by id
    .put(putUserById)
    // DONE: delete user by id
    .delete(deleteUser);

export default userRouter;