import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is a required field'],
  },

  description: {
    type: String,
    required: [true, 'Description is a required field'],
  },

  developerName: {
    type: String,
    required: true,
  },

  webUrl: {
    type: String,
    default: null,
  },
  repoLink: {
    type: String,
    default: null,
  },
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
