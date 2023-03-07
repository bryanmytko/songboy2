const generateLeads = (song: string, name: string) => [
  `This one goes out to ${name}. Here's ${song}`,
  `${name} has requested ${song}, so let's take that one for a spin.`,
  `Can we get some poggers in the chat for ${song}`,
  `Another request coming in from ${name}`,
  `Here's another Song Boy classic... ${song}`,
  `Here's the summer jam of 2022, none other than ${song}`,
  "Oooh this one is spicy",
  "Sup Buh-Buh-Buh-Buh-Boyz, Song Boy here with another banger",
  `Song Boy Radio, one-oh-four-point-quin-sixty-nine on your FM dial. Here's ${song}`,
  `Shout out to big ${name}. Let's go!`,
  "I had my first kiss to this one.",
  `Everybody get ready to swing your floppy dick to this jam: ${song}`,
  `Another cordwainer anthem coming right up, here's ${song}`,
  `Here's another treasure straight from your Horadric cube, none other than ${song}`,
  `${name} must be wainin' because that's the only time I'd expect to hear ${song}`,
  `${name} that's the perfect soundtrack for dropping a big tier three sub to pink Q.T. here's ${song}`,
  `${name}? Nut. ${song}`,
  `Here's DMX with Ruff Ryders... just kidding: this one is called ${song}`,
  `Here's a double you straight outta Ragnaros, nada menos que la cancion de exito ${song}`,
  `${name} lost their virginity to this hit. Here's ${song}`,
  "Woo, this pick is spicier than a used Drake condom",
  `Thanks, ${name}, now everyone will hate you`,
  `This little ditty goes out to Pumpkin Spice Bryce. Here is ${song}`,
  `Get out your motion lotion for this jam. This is ${song}`,
  `Here comes another piece of arthouse hipster bullshit from ${name}`,
  "Welp. At least it isn't nickleback",
  "Anyway, here's Wonderwall...",
  `Here's ${song}. Enjoy your music, Boomer.`,
  "Meredith, I’m worried that the baby thinks people can’t change...",
  `Sup y'all, it's me, it's ya boy ${name}.`,
  `Hi, I'm Songboy and I'm being forced to play ${song}`,
  `Snap your fingers and your spaghetti noodles to this hit. Here's ${song}`,
  "This one goes out to Fippy Fappy. Rest in peace.",
  `This is the song that inspired Eddie Vedder to jump out of a bush. Here's ${song}`,
];

const randomSongLead = (song: string, name: string) =>
  `Here's a random pick, originally requested by ${name}. This is ${song}`;

const randomLead = (song: string, name: string) => {
  const LEADS = generateLeads(song, name);

  return LEADS[Math.floor(Math.random() * LEADS.length)];
};

export { randomLead, randomSongLead };
