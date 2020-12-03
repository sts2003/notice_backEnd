import mongoose from "mongoose";
import Notice from "../../../model/Notice";
import User from "../../../model/User";
import { CURRENT_TIME } from "../../../../src/utils/commonUtils";

export default {
  Query: {
    getAllNotices: async (_, args) => {
      const { searchValue, limit, currentPage } = args;
      try {
        const result = await Notice.find(
          {
            $or: [
              { title: { $regex: `.*${searchValue}.*` } },
              { description: { $regex: `.*${searchValue}.*` } },
            ],
          },
          {}
        )
          .sort({
            createdAt: -1,
          })
          .limit(limit)
          .skip(currentPage * limit);

        return result;
      } catch (e) {
        console.log(e);
        return [];
      }
    },

    getNoticeDetail: async (_, args) => {
      const { id } = args;
      console.log(id);
      try {
        const detailDatum = await Notice.findOne({ _id: id });

        return detailDatum;
      } catch (e) {
        console.log(e);
        return {};
      }
    },

    getNoticeBoardTotalPage: async (_, args) => {
      const { searchValue, limit } = args;

      try {
        const result = await Notice.find({
          title: { $regex: `.*${searchValue}.*` },
        }).sort({
          createdAt: -1,
        });

        const cnt = result.length;

        const realTotalPage = cnt % limit > 0 ? cnt / limit + 1 : cnt / limit;

        return parseInt(realTotalPage);
      } catch (e) {
        console.log(e);
        return 0;
      }
    },
    getNoticeBoardNextId: async (_, args) => {
      const { id } = args;
      console.log(id);

      try {
        const result = await Notice.findOne({
          _id: { $lt: id },
        })
          .sort({
            createdAt: -1,
          })
          .limit(1);

        return result;
      } catch (e) {
        console.log(e);
        return {};
      }
    },

    getNoticeBoardBeforeId: async (_, args) => {
      const { id } = args;
      console.log(id);

      try {
        const result = await Notice.findOne({
          _id: { $gt: id },
        })
          .sort({
            createdAt: 1,
          })
          .limit(1);

        return result;
      } catch (e) {
        console.log(e);
        return {};
      }
    },
  },

  Mutation: {
    createNotice: async (_, args) => {
      const { title, description, userId } = args;

      try {
        const current = await CURRENT_TIME();

        const newUserId = mongoose.Types.ObjectId(userId);

        const result = await Notice.create({
          title,
          description,
          createdAt: current,
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
      const { id } = args;

      console.log(id);

      try {
        const result = await Notice.deleteOne({ _id: id });

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },

    updateNotice: async (_, args) => {
      try {
        const { id, title, description } = args;

        const result = await Notice.updateOne(
          { _id: id },
          {
            $set: {
              title,
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
