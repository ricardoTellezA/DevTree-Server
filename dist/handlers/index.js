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
exports.searchByHandle = exports.getUserByHandle = exports.uploadImage = exports.updateProfile = exports.getUser = exports.login = exports.createAccount = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const slug_1 = __importDefault(require("slug"));
const formidable_1 = __importDefault(require("formidable"));
const uuid_1 = require("uuid");
const jwt_1 = require("../utils/jwt");
const jsonwebtoken_1 = require("jsonwebtoken");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userExist = yield User_1.default.findOne({ email });
    if (userExist) {
        const error = new Error('El usuario ya esta registrado con este correo');
        res.status(409).json({ error: error.message });
        return;
    }
    const handle = (0, slug_1.default)(req.body.handle, '');
    const handleExist = yield User_1.default.findOne({ handle });
    if (handleExist) {
        const error = new Error('Nombre de usuario no disponible');
        res.status(409).json({ error: error.message });
        return;
    }
    const user = new User_1.default(req.body);
    user.password = yield (0, auth_1.hashPassword)(password);
    user.handle = handle;
    user.save();
    res.status(201).send("Registro creado con exito");
});
exports.createAccount = createAccount;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        const error = new Error('El usuario no existe');
        res.status(401).json({ error: error.message });
        return;
    }
    const isPasswordCorrect = yield (0, auth_1.checkPassword)(password, user.password);
    if (!isPasswordCorrect) {
        const error = new Error('Password incorrecto');
        res.status(401).json({ error: error.message });
        return;
    }
    const token = (0, jwt_1.generateJWT)({ id: user.id });
    res.send(token);
});
exports.login = login;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bearer = req.headers.authorization;
    const [, token] = bearer.split(' ');
    if (!token) {
        const error = new Error('Usuario no autorizado');
        res.status(401).json({ error: error.message });
        return;
    }
    try {
        const result = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        if (typeof result === 'object' && result.id) {
            const user = yield User_1.default.findById(result.id).select('-password');
            res.send(user);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error de servidor' });
    }
});
exports.getUser = getUser;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { description, links } = req.body;
        const handle = (0, slug_1.default)(req.body.handle, '');
        const handleExist = yield User_1.default.findOne({ handle });
        if (handleExist && handleExist.email !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email)) {
            const error = new Error('Nombre de usuario no disponible');
            res.status(409).json({ error: error.message });
            return;
        }
        if (!req.user) {
            const error = new Error('Usuario no encontrado');
            res.status(404).json({ error: error.message });
            return;
        }
        req.user.description = description;
        req.user.links = links;
        req.user.handle = handle;
        yield ((_b = req.user) === null || _b === void 0 ? void 0 : _b.save());
        res.send('Usuario editado correctamente');
    }
    catch (error) {
        const errorMessage = new Error('Hubo un error');
        res.status(500).json({ error: errorMessage.message });
        return;
    }
});
exports.updateProfile = updateProfile;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const form = (0, formidable_1.default)({ multiples: false });
    try {
        form.parse(req, (error, fields, files) => {
            if (files.file) {
                cloudinary_1.default.uploader.upload(files.file[0].filepath, { public_id: (0, uuid_1.v4)() }, function (error, result) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            const error = new Error('Hubo un error al subir la imagen');
                            res.status(500).json({ error: error.message });
                            return;
                        }
                        if (result) {
                            req.user.image = result.secure_url;
                            yield req.user.save();
                            res.json({ image: result.secure_url });
                        }
                    });
                });
            }
        });
    }
    catch (error) {
        const errorMessage = new Error('Hubo un error');
        res.status(500).json({ error: errorMessage.message });
        return;
    }
});
exports.uploadImage = uploadImage;
const getUserByHandle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { handle } = req.params;
        const user = yield User_1.default.findOne({ handle }).select('-_id -__v -password -email');
        if (!user) {
            const error = new Error('El Usuario no existe');
            res.status(404).json({ error: error.message });
            return;
        }
        res.json(user);
    }
    catch (error) {
        const errorMessage = new Error('Hubo un error');
        res.status(500).json({ error: errorMessage.message });
        return;
    }
});
exports.getUserByHandle = getUserByHandle;
const searchByHandle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { handle } = req.body;
        const userExist = yield User_1.default.findOne({ handle });
        if (userExist) {
            const error = new Error(`${handle} ya esta registrado`);
            res.status(404).json({ error: error.message });
            return;
        }
        res.send(`${handle} esta disponible`);
    }
    catch (error) {
        const errorMessage = new Error('Hubo un error');
        res.status(500).json({ error: errorMessage.message });
        return;
    }
});
exports.searchByHandle = searchByHandle;
