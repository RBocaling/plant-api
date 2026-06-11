"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenAIClient = void 0;
const openai_1 = __importDefault(require("openai"));
let client = null;
const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not configured on the server.");
    }
    if (!client) {
        client = new openai_1.default({ apiKey });
    }
    return client;
};
exports.getOpenAIClient = getOpenAIClient;
