import express from 'express';
const port = 3001;
const app = express();
import mongoose, { isObjectIdOrHexString, isValidObjectId } from 'mongoose';
import UserRouter from './Routes/user';
import { date, string } from 'zod';
const userInfoSchema = new mongoose.Schema({
    email:String,
    password:String
})
const TodoSchema = new mongoose.Schema({
    Title:String,
    DueDate:Date,
    userId:String
})
app.use(express.json());
app.use("/user",UserRouter);
export const Todo = mongoose.model('userTodo',TodoSchema)
export const User = mongoose.model('userDetails',userInfoSchema);
mongoose.connect("mongodb+srv://navravi31122002:Navanith%4056@cluster0.xgytx.mongodb.net/Todo");
app.listen(port,()=>{
    console.log("running on 3001");
})