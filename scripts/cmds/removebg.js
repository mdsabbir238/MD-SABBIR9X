const axios = require("axios");
const { shorten } = require('tinyurl');

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

(async () => {
  global.apis = {
    diptoApi: await baseApiUrl(),
  };
})();

module.exports = {
  config: {
    name: "removebg",
    aliases: ["rbg","rmbg"],
    version: "1.6.9",
    role: 0,
    author: "Nazrul",
    category: "tools",
    cooldowns: 5,
    guide: {
      en: "Use this command by replying to an image. The bot will remove the background.",
    },
  },
  onStart: async ({ api, event }) => {
    try {

      if (event.messageReply && event.messageReply.attachments[0]?.url) {
        const imageUrl = event.messageReply.attachments[0].url;
        
        const shortenedUrl = await shorten(imageUrl);
        const response = await axios.get(
          `${global.apis.diptoApi}/rmbg?url=${shortenedUrl}`,
          { responseType: 'stream' }
        );

        api.sendMessage({
          body: `🪄 Image Background removed successfully! ✨`,
          attachment: response.data,
        }, event.threadID, event.messageID);
      } else {
   
        api.sendMessage(
          `⚠️ Please reply to an image.!`,
          event.threadID
        );
      }
    } catch (error) {

      console.error(error);
      api.sendMessage(
        `❌ Please try again later.`,
        event.threadID
      );
    }
  },
};
