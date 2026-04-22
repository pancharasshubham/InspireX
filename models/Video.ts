import mongoose, { Schema, model, models } from "mongoose";

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: string;
  controls?: boolean;
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    category: { type: String, default: "motivation" },
    controls: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Video = models.Video || model<IVideo>("Video", videoSchema);

export default Video;