import { NextFunction, Request, Response } from "express";
import { Animal } from "../../types/Animal";
import CustomError from "../../classes/CustomError";
import { MessageResponse } from "../../types/Messages";
import AnimalModel from "../models/animalModel";

const getAnimalsByBox = async (
  req: Request<{}, {}, {}, {topRight: string, bottomLeft: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const {topRight, bottomLeft} = req.query;

    // data validointi tähän, ennen find animals
    console.log(topRight);
    console.log(bottomLeft);
    const animals = await AnimalModel.find({
      location: {
        $geoWithin: {
          $box:
            [bottomLeft.split(','), topRight.split(',')],
        }
      }
    })
      .select('-__v')
      .populate({
        path: 'species',
        select: '-__v',
        populate: {
          path: 'category',
          select: '-__v'
        }
      });

    res.json(animals);

  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

type DBMessageResponse = MessageResponse & {
  data: Animal | Animal[];
};

const postAnimal = async (
  req: Request<{}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    // tee AnimalModel perustella uusi dokumentti
    const newAnimal = new AnimalModel(req.body);

    // talenna tietokantaan
    const savedAnimal = await newAnimal.save();
    res.status(201).json({
      message: 'Animal created',
      data: savedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimals = async (
  req: Request,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const animals = await AnimalModel.find()
      .select('-__v')
      .populate({
        path: 'species',
        select: '-__v',
        populate: {
          path: 'category',
          select: '-__v'
        }
      });

    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

const getAnimal = async (
  req: Request<{id: string}>,
  res: Response<Animal>,
  next: NextFunction,
) => {
  try {
    const animal = await AnimalModel.findById(req.params.id)
    .select('-__v')
    .populate({
      path: 'species',
      select: '-__v',
      populate: {
        path: 'category',
        select: '-__v'
      }
    });

    if (!animal) {
      throw new CustomError('Animal not found', 404);
    }

    res.json(animal);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putAnimal = async (
  req: Request<{id: string}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedAnimal = await AnimalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
    );

    if (!updatedAnimal) {
      throw new CustomError('Animal not found', 404);
    }

    res.json({
      message: 'Animal updated',
      data: updatedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteAnimal = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedAnimal = await AnimalModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedAnimal) {
      throw new CustomError('Animal not found', 404);
    }

    res.json({
      message: 'Animal deleted',
      data: deletedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getBySpecies = async (
  req: Request<{species: string}>,
  res: Response<Animal[]>,
  next: NextFunction
) => {
  try {
    const animals = await AnimalModel.findBySpecies(req.params.species);

    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {postAnimal, getAnimals, getAnimal, deleteAnimal, putAnimal, getAnimalsByBox, getBySpecies};
