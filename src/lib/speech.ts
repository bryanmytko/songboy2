import textToSpeech from "@google-cloud/text-to-speech";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import { Readable } from "stream";
import { Song } from "../types/player";
import { randomVoice } from "./tts/voices";
import { getLead } from "./tts/leads";
import { Logger } from "tslog";

process.env.GOOGLE_APPLICATION_CREDENTIALS = "../../google-key.json";

console.log("CREDS", process.env.GOOGLE_APPLICATION_CREDENTIALS);

const log: Logger = new Logger();
const client = new textToSpeech.TextToSpeechClient();

const getHook = async (song: Song) => {
  const text = await getLead(song);

  return synthesizedSpeechStream({
    input: { text },
    voice: randomVoice(),
    audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
  });
};

const getSpeech = async (text: string) =>
  synthesizedSpeechStream({
    input: { text },
    voice: randomVoice(),
    audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
  });

const synthesizedSpeechStream = async (
  request: google.cloud.texttospeech.v1.ISynthesizeSpeechRequest
) => {
  try {
    const [response] = await client.synthesizeSpeech(request);
    const stream = new Readable();
    stream.push(response.audioContent);
    stream.push(null);

    return stream;
  } catch (e) {
    log.error("Could not get a stream from google.");
    return "Songboy is broken. Tell Bryan.";
  }
};

export { getHook, getSpeech };
