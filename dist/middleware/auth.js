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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error('No autorizado');
        res.status(401).json({ error: error.message });
        return;
    }
    const [, token] = bearer.split(' ');
    if (!token) {
        const error = new Error('No autorizado');
        res.status(401).json({ error: error.message });
        return;
    }
    try {
        const result = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof result === 'object' && result.id) {
            const user = yield User_1.default.findById(result.id).select('-password');
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            req.user = user;
            next();
        }
    }
    catch (error) {
        console.log("🚀 ~ getUser ~ error:", error);
        res.status(500).json({ error: 'Token no válido' });
    }
});
exports.authenticate = authenticate;
