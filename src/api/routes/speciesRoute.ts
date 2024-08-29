import express from 'express';
import {
  deleteSpecies,
  getSpecie,
  getSpecies,
  postSpecies,
  putSpecies
} from '../controllers/speciesController';

const router = express.Router();


router.route('/').post(postSpecies).get(getSpecies);

router.route('/:id').get(getSpecie).put(putSpecies).delete(deleteSpecies);

export default router;
