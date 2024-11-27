"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const express_1 = __importDefault(require("express"));
const todo_1 = require("../todo");
const auth_1 = require("../middleware/auth");
const userDetailsStructure = zod_1.z.object({
    email: zod_1.z.string().min(1).email(),
    password: zod_1.z.string().min(8)
});
const TodoStructure = zod_1.z.object({
    Title: zod_1.z.string().min(1),
    DueDate: zod_1.z.date()
});
const Router = express_1.default.Router();
Router.post("/todo", auth_1.UserAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Title, DueDate } = req.body;
    const parsedInput = TodoStructure.safeParse({
        Title: Title,
        DueDate: new Date(DueDate)
    });
    if (!parsedInput.success) {
        res.json({ message: "Input format error" });
    }
    else {
        const user = yield todo_1.User.findOne({ email: req.headers.user });
        if (user) {
            const userId = user._id;
            const newTodo = new todo_1.Todo({ Title, DueDate, userId });
            yield newTodo.save();
            res.send({ message: "Todo added successfully" });
        }
    }
}));
Router.get("/getTodo", auth_1.UserAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userTodo = yield todo_1.User.findOne({ email: req.headers.user });
    if (userTodo) {
        const user_id = userTodo._id;
        const todo = yield todo_1.Todo.find({ userId: user_id });
        if (!todo) {
            res.send("there is no todos to display");
        }
        res.json(todo);
    }
    else {
        res.send("there is no todo");
    }
}));
Router.post('/login', auth_1.UserAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = userDetailsStructure.safeParse(req.body);
    if (!parsedInput.success) {
        res.json(parsedInput.error);
    }
    else {
        const { email, password } = req.body;
        const isUser = yield todo_1.User.findOne({ email, password });
        if (isUser) {
            const token = (0, auth_1.generateUsertoken)(email);
            res.json({ message: "Login successful", token: token });
        }
        else {
            res.json({ message: "user doesn't already exists" });
        }
    }
}));
Router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = userDetailsStructure.safeParse(req.body);
    if (!parsedInput.success) {
        res.json(parsedInput.error);
    }
    else {
        const { email, password } = req.body;
        const isUser = yield todo_1.User.findOne({ email });
        console.log(isUser);
        if (!isUser) {
            const newUser = new todo_1.User({ email, password });
            yield newUser.save();
            const token = (0, auth_1.generateUsertoken)(email);
            res.json({ message: "signin successful", token: token });
        }
        else {
            res.json({ message: "email already exists" });
        }
    }
}));
exports.default = Router;
