import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {
  getMentalHealthEntries,
  postMentalHealthEntry,
  putMentalHealthEntry,
  deleteMentalHealthEntry
} from '../controllers/mentalhealth-controller.js';

const mentalhealthRouter = express.Router();

mentalhealthRouter.use(authenticateToken); // Suojataan pyynnöt autentikaatiolla

mentalhealthRouter.route('/')
  .get(getMentalHealthEntries)
  .post(postMentalHealthEntry);

mentalhealthRouter.route('/:id')
  .put(putMentalHealthEntry)
  .delete(deleteMentalHealthEntry);

export default mentalhealthRouter;