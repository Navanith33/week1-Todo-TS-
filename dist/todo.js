"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Todo = void 0;
const express_1 = __importDefault(require("express"));
const port = 3001;
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./Routes/user"));
const userInfoSchema = new mongoose_1.default.Schema({
    email: String,
    password: String
});
const TodoSchema = new mongoose_1.default.Schema({
    Title: String,
    DueDate: Date,
    userId: String
});
app.use(express_1.default.json());
app.use("/user", user_1.default);
exports.Todo = mongoose_1.default.model('userTodo', TodoSchema);
exports.User = mongoose_1.default.model('userDetails', userInfoSchema);
mongoose_1.default.connect("mongodb+srv://navravi31122002:Navanith%4056@cluster0.xgytx.mongodb.net/Todo");
app.listen(port, () => {
    console.log("running on 3001");
});
