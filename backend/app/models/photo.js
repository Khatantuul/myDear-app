import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    note: {type: String, required: false},
    tags: [String],
    url: {type: String, required: false}
  });

const Photo = mongoose.model("Photo",photoSchema);

export default Photo;