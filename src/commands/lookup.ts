// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import Twit from "twit";

// Initializing Twitter Client
const T = new Twit({
  consumer_key: "usB0kjPdY6YSwUlNekm7nYLiq",
  consumer_secret: "eSPUzjwRUu6RRZpqGilaLvfOUaogOiRBRqyoi1hwJPvtWCFmRY",
  access_token: "993214465544876032-mf6cSpg90cRzH2RnLZ582siViLNEpi7",
  access_token_secret: "64ros8ve7ucOxYDCgzKl4qsnNQJmSBRjUPFOXiSXM7be1",
});

class LookupCommand extends Command {
  constructor() {
    super("lookup", {
      aliases: ["lookup"],
      args: [
        {
          id: "search",
          type: "string",
        },
      ],
    });
  }

  exec(message: Message, args: any) {
    let searchTerm: string;

    // Parse search term
    if (args.search.startsWith("@")) {
      searchTerm = args.search.replace("@", "");
    } else {
      searchTerm = args.search;
    }

    // Search user
    T.get("/users/show", { screen_name: searchTerm }, (err: any, data: any) => {
      if (!err) {
        // Creating embed
        const embed = new Discord.MessageEmbed()
          .setColor("#5761C9")
          .setTitle(data.name)
          .setURL(`https://twitter.com/${searchTerm}`)
          .setDescription(data.description)
          .setThumbnail(data.profile_image_url_https);

        // Adding data if available
        if (data.url) {
          embed.addField("Website", data.url);
        }
        if (data.location) {
          embed.addField("Location", data.location);
        }
        if (data.created_at) {
          embed.addField("Created", data.created_at);
        }
        if (data.followers_count) {
          embed.addField("Followers", data.followers_count);
        }
        if (data.friends_count) {
          embed.addField("Following", data.friends_count);
        }

        // Sending embed to requester channel
        message.channel.send(embed);
      } else {
        // Creating embed
        const embed = new Discord.MessageEmbed()
          .setColor("#5761C9")
          .setTitle("Error searching user");

        // Sending embed to requester channel
        message.channel.send(embed);
      }
    });
  }
}

module.exports = LookupCommand;
export {};
