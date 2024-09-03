import { Model, Types } from "mongoose";
import { Point, Polygon } from 'geojson';
import { Category } from "./Category";

type Species = {
  species_name: string;
  image: string;
  category: Types.ObjectId | Category;
  location: Point;
};

type SpeciesModal = Model<Species> & {
  findByArea: (polygon: Polygon) => Promise<Species[]>
};

export {Species, SpeciesModal};
