import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {
  getPhysicalHealthEntries,
  postPhysicalHealthEntry,
  putPhysicalHealthEntry,
  deletePhysicalHealthEntry,
} from '../controllers/physicalhealth-controller.js';

const physicalhealthRouter = express.Router();

physicalhealthRouter.use(authenticateToken); // Suojataan pyynnöt autentikaatiolla

physicalhealthRouter.route('/')
  .get(getPhysicalHealthEntries)
  .post(postPhysicalHealthEntry);

physicalhealthRouter.route('/:id')
  .put(putPhysicalHealthEntry)
  .delete(deletePhysicalHealthEntry);

export default physicalhealthRouter;