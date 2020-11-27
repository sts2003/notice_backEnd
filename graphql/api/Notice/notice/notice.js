import mongoose from "mongoose";
import Notice from "../../../model/Notice";
import User from "../../../model/User";

export default {
  Query: {
    getAllNotices: async (_, args) => {
      try {
        const result = await Notice.find({}, {});

        return result;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
  },

  Mutation: {
    createNotice: async (_, args) => {
      const { title, description, userId } = args;
      try {
        const newUserId = mongoose.Types.ObjectId(userId);
        const result = await Notice.create({
          title,
          description,
          createdAt: new Date().toString(),
          author: newUserId,
          isDelete: false,
        });

        const newNoticeId = mongoose.Types.ObjectId(result._id);

        const parentUser = await User.findOne({ _id: userId });

        parentUser.notice.push(newNoticeId);
        parentUser.save();

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },

    deleteNotice: async (_, args) => {
      try {
        const { id } = args;

        const result = await Notice.deleteOne({ _id: id });

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },

    updateNotice: async (_, args) => {
      try {
        const { id, description } = args;

        const result = await Notice.updateOne(
          { _id: id },
          {
            $set: {
              description,
            },
          }
        );

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
};
