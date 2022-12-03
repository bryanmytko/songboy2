const VOICES = [
  { languageCode: "en-AU", name: "en-AU-Standard-A", ssmGender: "FEMALE" },
  { languageCode: "en-AU", name: "en-AU-Standard-B", ssmGender: "MALE" },
  { languageCode: "en-AU", name: "en-AU-Standard-C", ssmGender: "FEMALE" },
  { languageCode: "en-AU", name: "en-AU-Standard-D", ssmGender: "MALE" },
  { languageCode: "en-AU", name: "en-AU-Wavenet-A", ssmGender: "FEMALE" },
  { languageCode: "en-AU", name: "en-AU-Wavenet-B", ssmGender: "MALE" },
  { languageCode: "en-AU", name: "en-AU-Wavenet-C", ssmGender: "FEMALE" },
  { languageCode: "en-AU", name: "en-AU-Wavenet-D", ssmGender: "MALE" },
  { languageCode: "en-IN", name: "en-IN-Standard-A", ssmGender: "FEMALE" },
  { languageCode: "en-IN", name: "en-IN-Standard-B", ssmGender: "MALE" },
  { languageCode: "en-IN", name: "en-IN-Standard-C", ssmGender: "MALE" },
  { languageCode: "en-IN", name: "en-IN-Standard-D", ssmGender: "FEMALE" },
  { languageCode: "en-IN", name: "en-IN-Wavenet-A", ssmGender: "FEMALE" },
  { languageCode: "en-IN", name: "en-IN-Wavenet-B", ssmGender: "MALE" },
  { languageCode: "en-IN", name: "en-IN-Wavenet-C", ssmGender: "MALE" },
  { languageCode: "en-IN", name: "en-IN-Wavenet-D", ssmGender: "FEMALE" },
  { languageCode: "en-GB", name: "en-GB-Standard-A", ssmGender: "FEMALE" },
  { languageCode: "en-GB", name: "en-GB-Standard-B", ssmGender: "MALE" },
  { languageCode: "en-GB", name: "en-GB-Standard-C", ssmGender: "FEMALE" },
  { languageCode: "en-GB", name: "en-GB-Standard-D", ssmGender: "MALE" },
  { languageCode: "en-GB", name: "en-GB-Standard-F", ssmGender: "FEMALE" },
  { languageCode: "en-GB", name: "en-GB-Wavenet-A", ssmGender: "FEMALE" },
  { languageCode: "en-GB", name: "en-GB-Wavenet-B", ssmGender: "MALE" },
  { languageCode: "en-GB", name: "en-GB-Wavenet-C", ssmGender: "FEMALE" },
  { languageCode: "en-GB", name: "en-GB-Wavenet-D", ssmGender: "MALE" },
  { languageCode: "en-GB", name: "en-GB-Wavenet-F", ssmGender: "FEMALE" },
  { languageCode: "en-US", name: "en-US-Standard-B", ssmGender: "MALE" },
  { languageCode: "en-US", name: "en-US-Standard-C", ssmGender: "FEMALE" },
  { languageCode: "en-US", name: "en-US-Standard-D", ssmGender: "MALE" }, // 28
  { languageCode: "en-US", name: "en-US-Standard-E", ssmGender: "FEMALE" },
  { languageCode: "en-US", name: "en-US-Standard-G", ssmGender: "FEMALE" },
  { languageCode: "en-US", name: "en-US-Standard-H", ssmGender: "FEMALE" },
  { languageCode: "en-US", name: "en-US-Standard-I", ssmGender: "MALE" },
  { languageCode: "en-US", name: "en-US-Standard-J", ssmGender: "MALE" },
  { languageCode: "en-US", name: "en-US-Wavenet-A", ssmGender: "MALE" },
  { languageCode: "en-US", name: "en-US-Wavenet-B", ssmGender: "MALE" },
  { languageCode: "en-US", name: "en-US-Wavenet-C", ssmGender: "FEMALE" },
  { languageCode: "en-US", name: "en-US-Wavenet-D", ssmGender: "MALE" },
  { languageCode: "en-US", name: "en-US-Wavenet-E", ssmGender: "FEMALE" },
  { languageCode: "en-US", name: "en-US-Wavenet-F", ssmGender: "FEMALE" },
  { languageCode: "en-US", name: "en-US-Wavenet-G", ssmGender: "FEMALE" },
  { languageCode: "en-US", name: "en-US-Wavenet-H", ssmGender: "FEMALE" },
  { languageCode: "en-US", name: "en-US-Wavenet-I", ssmGender: "MALE" },
];

const randomVoice = () => VOICES[Math.floor(Math.random() * VOICES.length)];

export { randomVoice };