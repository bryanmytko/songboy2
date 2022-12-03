import textToSpeech from "@google-cloud/text-to-speech";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import { Readable } from "stream";
import { Song } from "../types/player";
import { VOICES } from "./voices";

const client = new textToSpeech.TextToSpeechClient();

const getHook = async (song: Song) => {
  const testLead = `This is gonna be a real good song. Here's ${song.title}`;

  return synthesizedSpeechStream({
    input: { text: testLead },
    voice: randomVoice(),
    audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
  });
};

const synthesizedSpeechStream = async (
  request: google.cloud.texttospeech.v1.ISynthesizeSpeechRequest
) => {
  const [response] = await client.synthesizeSpeech(request);
  const stream = new Readable();
  stream.push(response.audioContent);
  stream.push(null);

  return stream;
};

const randomVoice = () => VOICES[Math.floor(Math.random() * VOICES.length)];

export { getHook };
