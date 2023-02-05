import { config } from "dotenv";
config();
import schedule from 'node-schedule'
import * as indexRouter from "./modules/index.router.js";
import { connectDB } from "./DB/connect.js";
import express from "express";
import scheduleFunction from "./service/schedule.js";
const app = express();
const port = process.env.port;
const baseUrl = process.env.BASEURL;
app.use(express.json());
app.use(`${baseUrl}/auth`, indexRouter.authRouter);
app.use(`${baseUrl}/user`, indexRouter.userRouter);
app.use(`${baseUrl}/post`, indexRouter.postRouter);
app.use(`${baseUrl}/comment`, indexRouter.commentRouter);

app.use("*", (req, res) => res.status(404).send("In-valid Routing"));
const jop = schedule.scheduleJob('0 30 13 * * *',function(){
scheduleFunction()
})
connectDB();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
