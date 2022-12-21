import mongoose from 'mongoose';

const connectDB = async () => {
  console.log(process.env.MONGO_URI)
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
