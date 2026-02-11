import express from 'express';
import {
  getEntries,
  getEntryById,
  postEntry,
} from '../controllers/entry-controller.js';

const entryRouter = express.Router();

entryRouter.route('/').get(getEntries).post(postEntry);

entryRouter.route('/:id').get(getEntryById);

export default entryRouter;