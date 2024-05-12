"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SALT_FACTOR = 10;
const ClassSchema = new mongoose_1.default.Schema({
    id: { type: Number, required: true },
    participants: { type: [String], required: true },
    start: { type: Date, required: true },
    duration: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    description: { type: String, required: false },
    type: { type: String, required: true },
    difficulty: { type: String, required: false }
});
exports.Class = mongoose_1.default.model('Class', ClassSchema);
