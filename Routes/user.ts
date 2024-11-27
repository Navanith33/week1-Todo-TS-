import {z} from 'zod'
import express from 'express';
import { User,Todo } from '../todo';
import { UserAuthentication,generateUsertoken } from '../middleware/auth';
const userDetailsStructure = z.object({
    email:z.string().min(1).email(),
    password:z.string().min(8)
});
const TodoStructure = z.object({
    Title:z.string().min(1),
    DueDate:z.date()
})
const Router = express.Router();
Router.post("/todo",UserAuthentication,async(req,res)=>{
       const {Title,DueDate}=req.body;
       const parsedInput = TodoStructure.safeParse({
        Title:Title,
        DueDate: new Date(DueDate)
       })
       if(!parsedInput.success){
        res.json({message:"Input format error"});
       }
       else{
        const user = await User.findOne({email:req.headers.user})
        if(user){
            const userId = user._id;
            const newTodo = new Todo({Title,DueDate,userId});
            await newTodo.save();
            res.send({message:"Todo added successfully"})
        }
       }
})
Router.get("/getTodo",UserAuthentication,async(req,res)=>{
        const userTodo = await User.findOne({email:req.headers.user});
        if(userTodo){
            const user_id = userTodo._id;
            const todo = await Todo.find({userId:user_id});
            if(!todo){
                res.send("there is no todos to display");
            }
            res.json(todo);
        }
        else{
            res.send("there is no todo");
        }
})
Router.post('/login',UserAuthentication,async(req,res)=>{
const parsedInput = userDetailsStructure.safeParse(req.body);
if(!parsedInput.success){
    res.json(parsedInput.error);
}
else{
    const{email,password}=req.body;
    const isUser = await User.findOne({email,password});
    if(isUser){
        const token = generateUsertoken(email);
        res.json({message:"Login successful",token:token});
    }
    else{
        res.json({message:"user doesn't already exists"});
    }
}
})
Router.post('/signin',async(req,res)=>{ 
    const parsedInput = userDetailsStructure.safeParse(req.body);
    if(!parsedInput.success){
        res.json(parsedInput.error);
    }
    else{
        const{email,password}=req.body;
        const isUser = await User.findOne({email});
        console.log(isUser);
        if(!isUser){
            const newUser = new User({email,password});
            await newUser.save();
            const token = generateUsertoken(email);
            res.json({message:"signin successful",token:token});
        }
        else{
            res.json({message:"email already exists"});
        }
    }
})
export default Router;