import { Configuration, OpenAIApi } from "openai";
import { Logger } from "tslog";
import { i18n } from "../i18n.config";

require("dotenv").config();

const log: Logger = new Logger();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const CHAT_MODEL = "text-davinci-003";

const chat = async (query: string) => {
  try {
    const completion = await openai.createCompletion({
      model: CHAT_MODEL,
      prompt: query,
      max_tokens: 64,
    });

    return completion.data.choices[0].text;
  } catch (error: any) {
    if (error.response) {
      log.error(error.response.status);
      log.error(error.response.data);
    } else {
      log.error(error.message);
    }
    return i18n.__("status.aiDown");
  }
};

export default chat;