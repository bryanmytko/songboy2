import { randomVoice } from "../../src/lib/voices";

describe("voices", () => {
  describe(".randomVoice", () => {
    test("it returns a random english voice", () => {
      const voice = randomVoice();

      expect(voice.languageCode).toMatch(/en-.*/);
      expect(voice.name).toMatch(/en-.*/);
      expect(["MALE", "FEMALE"]).toContain(voice.ssmGender);
    });
  });
});
