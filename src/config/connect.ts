import mongoose from "mongoose";

const connectDB = () => {
    // Connect to MongoDB
    mongoose
        .set("strictQuery", false)
        .connect(process.env.MONGO_URL)
        .then((data) => {
            console.log(`DataBase Connected: ${data.connection.host}`);
        }).catch((err) => {
            console.log(err);
            process.exit(1)
        });
};

export default connectDB;