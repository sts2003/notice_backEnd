import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    notice: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: `Notice`,
      },
    ],
  },

  {
    versionKey: false,
  }
);

export default mongoose.model(`User`, User, `User`);
