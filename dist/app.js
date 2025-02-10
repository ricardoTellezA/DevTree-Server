"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const server_1 = __importDefault(require("./server"));
const PORT = process.env.PORT || 4000;
server_1.default.listen(PORT, () => {
    console.log(colors_1.default.magenta.bold(`Servidor funcionando en el puerto: ${PORT}`));
});
