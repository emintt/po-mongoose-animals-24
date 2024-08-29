import { NextFunction, Request, Response } from "express";
import { Species } from "../../types/Species";
import { MessageResponse } from "../../types/Messages";
import speciesModel from "../models/speciesModel";
import CustomError from "../../classes/CustomError";


type DBMessageResponse = MessageResponse & {
  data: Species | Species[];
};

const postSpecies = async (
  req: Request<{}, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const newSpecies = new speciesModel(req.body);
    const savedSpecies = await newSpecies.save();
    res.status(201).json({
      message: 'Species created',
      data: savedSpecies
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSpecies = async (
  req: Request,
  res: Response<Species[]>,
  next: NextFunction
) => {
  try {
    const species = await speciesModel.find();
    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSpecie = async (
  req: Request<{id: string}>,
  res: Response<Species>,
  next: NextFunction
) => {
  try {
    const specie = await speciesModel.findById(req.params.id);
    console.log(req.params.id);
    if (!specie) {
      throw new CustomError('Specie not found', 404);
    }

    res.json(specie);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putSpecies = async (
  req: Request<{id: string}, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction
) => {
  try {
    const updatedSpecies = await speciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );

    if (!updatedSpecies) {
      throw new CustomError('Species not found', 404);
    }

    res.json({
      message: 'Species updated',
      data: updatedSpecies
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteSpecies = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<DBMessageResponse>,
  next: NextFunction
) => {
  try {
    const deletedSpecies = await speciesModel.findByIdAndDelete(req.params.id);

    if (!deletedSpecies) {
      throw new CustomError('species not found', 404);
    }

    res.json({
      message: "species deleted",
      data: deletedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

export { postSpecies, getSpecies, getSpecie, putSpecies, deleteSpecies };
