import { NextFunction, Request, Response } from "express";
import { Animal } from "../../types/Animal";
import CustomError from "../../classes/CustomError";
import { MessageResponse } from "../../types/Messages";
import animalModel from "../models/animalModel";

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
    const animals = await animalModel.find({
      location: {
        $geoWithin: {
          $box:
            [bottomLeft.split(','), topRight.split(',')],
        }
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
    // tee animalModel perustella uusi dokumentti
    const newAnimal = new animalModel(req.body);

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
    const animals = await animalModel.find();

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
    const animal = await animalModel.findById(req.params.id);

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
    const updatedAnimal = await animalModel.findByIdAndUpdate(
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
    const deletedAnimal = await animalModel.findByIdAndDelete(
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

export {postAnimal, getAnimals, getAnimal, deleteAnimal, putAnimal, getAnimalsByBox};
