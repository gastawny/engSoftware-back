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
const bcrypt_1 = __importDefault(require("bcrypt"));
const Teacher_1 = __importDefault(require("../models/Teacher"));
class TeacherController {
    static getTeachers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teachers = yield Teacher_1.default.find();
                const filteredTeachers = teachers.map((teacher) => ({
                    username: teacher.username,
                }));
                response.status(200).send(filteredTeachers);
            }
            catch (error) {
                response.status(500).send({ error: "Error", message: error.message });
            }
        });
    }
    static createTeacher(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = request.body;
                const salt = yield bcrypt_1.default.genSalt(12);
                const passwordHash = yield bcrypt_1.default.hash(password, salt);
                const newTeacher = new Teacher_1.default({ username, password: passwordHash });
                yield newTeacher.save();
                response.status(200).send({ message: "registered teacher" });
            }
            catch (error) {
                response.status(500).send({ error: "Error", message: error.message });
            }
        });
    }
    static deleteTeacher(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = request.body;
                const teacher = yield Teacher_1.default.findOne({ username });
                const checkPassword = yield bcrypt_1.default.compare(password, teacher.password);
                console.log(checkPassword, teacher.password, password);
                if (!checkPassword)
                    throw new Error("username or password invalid");
                const deletedTeacher = yield Teacher_1.default.findOneAndDelete({ username });
                if (!deletedTeacher)
                    throw new Error("username or password invalid");
                response.status(200).send({ message: `${username} deleted` });
            }
            catch (error) {
                response.status(500).send({ error: "Error", message: error.message });
            }
        });
    }
}
exports.default = TeacherController;
