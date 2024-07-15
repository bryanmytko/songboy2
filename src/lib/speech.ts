import textToSpeech from "@google-cloud/text-to-speech";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import { Readable } from "stream";
import { Song } from "../types/player";
import { randomVoice } from "./tts/voices";
import { getLead } from "./tts/leads";

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
  const [response] = await client.synthesizeSpeech(request);
  const stream = new Readable();
  stream.push(response.audioContent);
  stream.push(null);

  return stream;
};

export { getHook, getSpeech };
