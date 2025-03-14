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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = process.env.MONGO_URI;
        const { connection } = yield mongoose_1.default.connect(url);
        console.log(colors_1.default.cyan(`MongoDB conectado ${connection.host} - ${connection.port}`));
    }
    catch (error) {
        console.log(colors_1.default.bgRed.white.bold(error));
        process.exit(1);
    }
});
exports.connectDB = connectDB;
