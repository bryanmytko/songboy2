import { I18n } from "i18n";
import path from "path";

export const i18n = new I18n({
  defaultLocale: "en",
  directory: path.join(__dirname, "..", "locales"),
  locales: ["en"],
  objectNotation: true,
});
