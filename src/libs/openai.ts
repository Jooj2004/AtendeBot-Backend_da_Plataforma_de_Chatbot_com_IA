import { OpenAI } from "openai/client.js";

export const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
})