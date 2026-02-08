import { Comment, CommentBase, IComment } from "@/types/comment";
import { User } from "@/types/user";
import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface PostBase {
  user: User;
  text: string;
  comments?: IComment[];
  likes?: string[];
  imageurl?: string;
}

export interface IPost extends PostBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

interface IPostMethods {
  likePost(userID: string): Promise<void>;
  unlikePost(userID: string): Promise<void>;
  commentOnPost(comment: CommentBase): Promise<void>;
  getCommentsOnPost(): Promise<IComment[]>;
  removePost(): Promise<void>;
}

interface IPostStatics {
  getAllPosts(): Promise<IPostDocument[] | []>;
}

export interface IPostDocument extends IPost, IPostMethods {}
interface IPostModel extends IPostStatics, Model<IPostDocument> {}

const PostSchema = new Schema<IPostDocument>(
  {
    user: {
      userID: { type: String, required: true },
      userImage: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    text: { type: String, required: true },
    imageurl: { type: String },
    comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
    likes: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
);

PostSchema.methods.likePost = async function (userID: string) {
  try {
    await this.updateOne({ $addToSet: { likes: userID } });
  } catch (error) {
    console.log("Error while liking the post: ", error);
  }
};
PostSchema.methods.unlikePost = async function (userID: string) {
  try {
    await this.updateOne({ $pull: { likes: userID } });
  } catch (error) {
    console.log("Error while unliking the post: ", error);
  }
};
PostSchema.methods.removePost = async function () {
  try {
    await this.model("Post").deleteOne({ _id: this._id });
  } catch (error) {
    console.log("Error while removing the post: ", error);
  }
};

PostSchema.methods.commentOnPost = async function (commentsToAdd: CommentBase) {
  try {
    const comment = await Comment.create(commentsToAdd);
    this.comments.push(comment._id);
    await this.save();
  } catch (error) {
    console.log("Error while commenting on the post:", error);
  }
};

PostSchema.methods.getCommentsOnPost = async function () {
  try {
    await this.populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
    });
    return this.comments;
  } catch (error) {
    console.log("Error while getting all the comments on the post:", error);
    return [];
  }
};

PostSchema.statics.getAllPosts = async function () {
  try {
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",

        options: { sort: { createdAt: -1 } },
      })
      .lean();

    return posts.map((post: IPostDocument) => ({
      ...post,
      _id: post._id?.toString(),
      comments: post.comments?.map((comment: IComment) => ({
        ...comment,
        _id: comment._id?.toString(),
      })),
    }));
  } catch (error) {
    console.log("error when getting all posts", error);
    return [];
  }
};

export const Post =
  (models.Post as IPostModel) ||
  mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);
