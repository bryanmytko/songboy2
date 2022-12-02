import textToSpeech from "@google-cloud/text-to-speech";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import { Readable } from "stream";
import { Song } from "../types/player";

const client = new textToSpeech.TextToSpeechClient();

const getHook = async (song: Song) => {
  const testLead = `This is gonna be a real good song. Here's ${song.title}`;

  return synthesizedSpeechStream({
    input: { text: testLead },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 }
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

export { getHook };