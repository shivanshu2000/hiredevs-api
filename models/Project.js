import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is a required field'],
  },

  description: {
    type: String,
    required: [true, 'Description is a required field'],
  },

  clientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  developerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  accepted: {
    type: Boolean,
    default: false,
  },

  completedByDeveloper: {
    type: Boolean,
    default: false,
  },

  takenBack: {
    type: Boolean,
    default: false,
  },
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
