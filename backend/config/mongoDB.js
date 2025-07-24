import mongoose from "mongoose";

export const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🟢 MongoDB Connected Succsessfully!"))
    .catch((err) => console.log("❌ MongoDB Connection Unsuccessfull!", err))
}