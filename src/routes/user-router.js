import express from 'express';
import {postLogin, postUser} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.route('/')
    // POST new user
    .post(postUser);

// POST user login
userRouter.post('/login', postLogin);

export default userRouter;