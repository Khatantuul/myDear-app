import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    photoCount: {type: Number, required: false},
    title: {type: String, required: true},
    description: { type: String, required: false },
    tags: [String],
    photos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}],
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  });

const Album = mongoose.model("Album",albumSchema);

export default Album;