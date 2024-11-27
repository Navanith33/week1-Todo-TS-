"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsertoken = exports.UserAuthentication = exports.secret = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.secret = 'kavyashree';
const UserAuthentication = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            const parsed = token.split(' ')[1];
            const verify = jsonwebtoken_1.default.verify(parsed, exports.secret);
            console.log(verify);
            if (typeof verify === "string") {
                req.headers.user = verify;
                next();
            }
        }
        catch (e) {
            res.json({ message: "Auth failed" });
        }
    }
    else {
        res.status(403).json({ message: "Token is missing" });
    }
};
exports.UserAuthentication = UserAuthentication;
const generateUsertoken = (email) => {
    return jsonwebtoken_1.default.sign(email, exports.secret);
};
exports.generateUsertoken = generateUsertoken;
