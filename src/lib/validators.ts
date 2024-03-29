import { ChatInputCommandInteraction } from "discord.js";
import { i18n } from "../i18n.config";

const TMP_IMGS: String[] = [
  "https://media.tenor.com/images/7a28ad56a59500f38305a493cac0fee3/tenor.gif",
  "https://media1.tenor.com/images/596fec2152d6b02caf11facee5fcdffd/tenor.gif",
  "https://media1.tenor.com/images/98b5cf790161475a447bbd201085c597/tenor.gif",
  "https://media1.tenor.com/images/23733b37163bb20182c32e223192071d/tenor.gif",
  "https://media1.tenor.com/images/8c3b8de87353e2bf5b49fd7e25df0f0d/tenor.gif",
];

const randomImage = (): String =>
  TMP_IMGS[Math.floor(Math.random() * TMP_IMGS.length)];

export const VALID_TEXT_CHANNELS = ["songboy", "song-boy", "songs", "music"];

export const invalidTextChannel = (
  interaction: ChatInputCommandInteraction
) => {
  return void interaction.reply({
    embeds: [
      {
        title: i18n.__("command.rejection"),
        image: {
          url: String(randomImage()),
        },
      },
    ],
  });
};
