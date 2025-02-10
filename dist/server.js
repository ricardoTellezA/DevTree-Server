"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const router_1 = __importDefault(require("./router"));
const db_1 = require("./config/db");
(0, db_1.connectDB)();
const app = (0, express_1.default)();
// CORS
// app.use(cors(corsConfig))
app.use(express_1.default.json());
app.use('/', router_1.default);
exports.default = app;
