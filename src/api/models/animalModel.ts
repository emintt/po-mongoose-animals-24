import mongoose, { Schema } from "mongoose";
import { Animal } from "../../types/Animal";

const animalSchema = new mongoose.Schema<Animal>({
  animal_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  birthdate: {
    type: Date,
    required: true,
    max: Date.now()
  },
  species: {
    type: Schema.Types.ObjectId,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

export default mongoose.model('Animal', animalSchema);
