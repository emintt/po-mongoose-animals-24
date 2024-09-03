import { model, Schema } from "mongoose";
import { Species, SpeciesModal } from "../../types/Species";
import { Polygon } from "geojson";

const speciesSchema = new Schema<Species>({
  species_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  image: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  }
});


// polygon in this format: {"type":.., "coordinates":...}
speciesSchema.statics.findByArea = function (
  polygon: Polygon
): Promise<Species[]> {
  console.log(polygon);
 return this.find({
  location: {
    $geoWithin: {
      $geometry:
        polygon
    }
  }
 });
}

export default model<Species, SpeciesModal>('Species', speciesSchema);


// db.species.find({
//   location: {
//     $geoWithin: {
//       $geometry:
//       {
//         type: 'Polygon',
//         coordinates: [
//           [
//             [
//               16.36892780910685,
//               65.6827815838873
//             ],
//             [
//               33.29855720046936,
//               66.12712679087451
//             ],
//             [
//               30.769688924916608,
//               58.9673028558648
//             ],
//             [
//               16.211729903623535,
//               59.04175700302258
//             ],
//             [
//               16.36892780910685,
//               65.6827815838873
//             ]
//           ],
//         ],
//       }
//     }
//   }
// });
