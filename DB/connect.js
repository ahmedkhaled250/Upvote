import mongoose from "mongoose";

export const connectDB = async () => {
  return await mongoose
    .connect(process.env.DBURI)
    .then((res) => console.log(`connected DB ......${process.env.DBURI}`))
    .catch((err) => console.log(`Fail to connected DB ......${err}`));
};
