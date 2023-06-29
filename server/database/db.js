import mongoose from "mongoose";

const Connection = async (username, password) => {
  const URL = `mongodb+srv://patrickDev:4YZhfjLLoq0jUtWn@cluster0.kuzft.mongodb.net/whatsApp-clone?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    console.log("Database Connected Succesfully");
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

export default Connection;
