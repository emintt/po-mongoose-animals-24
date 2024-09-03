import express from 'express';
import {
  deleteSpecies,
  getSpecie,
  getSpecies,
  postSpecies,
  putSpecies,
  findSpeciesByArea
} from '../controllers/speciesController';
import { addImageToSpecies } from '../../middlewares';

const router = express.Router();


router.route('/').post(addImageToSpecies, postSpecies).get(getSpecies);

router.route('/area').post(findSpeciesByArea);

router.route('/:id').get(getSpecie).put(putSpecies).delete(deleteSpecies);

export default router;
