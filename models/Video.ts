import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1920,
  height: 1080,
} as const

export interface IVideo{
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  _id?: mongoose.Types.ObjectId;
  createAt?: Date;
  updateAt?: Date;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  }
}

const videoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  controls: { type: Boolean, default: true },
  transformation:{
    height: { type: Number, default: VIDEO_DIMENSIONS.height },
    width: { type: Number, default: VIDEO_DIMENSIONS.width },
    quality: { type: Number, default: 100, min: 1, max: 100 },
  }
}, { timestamps: true })
;

const Video = mongoose.models.Video || mongoose.model<IVideo>("Video", videoSchema)

export default Video;