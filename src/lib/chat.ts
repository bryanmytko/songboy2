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

    return trimCompletion(completion.data.choices[0].text);
  } catch (e) {
    log.error(e);
    return i18n.__("status.aiDown");
  }
};

const trimCompletion = (str: string | undefined): string => {
  if (!str) return "";

  const split = str.split(".");

  if (split.length <= 1) return str;
  split.pop();

  return `${split.join(".")}.`;
};

export default chat;
