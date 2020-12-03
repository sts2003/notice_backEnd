import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Notice = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    createdAt: {
      type: String,
      required: true,
    },

    isDelete: {
      type: Boolean,
      required: true,
      default: false,
    },

    deletedAt: {
      type: String,
    },

    author: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model(`Notice`, Notice, `Notice`);
