const fs = require("fs-extra");
const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get('https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json');
  return base.data.api;
};

module.exports = {
  config: {
    name: "bot2",
    version: "1.6.9",
    author: "♡ Nazrul ♡", //don't change author
    countDown: 5,
    role: 0,
    shortDescription: "Charming and Stylish Bot",
    description: "fun with bot",
    category: "fun",
    guide: {
      en: "{pn}",
    },
  },

  onStart: async function () {
    console.log("✨ The bot is online and ready to charm you!");
  },

  onChat: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    const messages = [
      "Hey You, Yes You, You Are So Beautiful", "i Love You🙂", "Yes Dear, I Am Here...😗", "I Love you", "Miss YoU Beppy", "😁Smile I am Taking Selfy✌🤳", "Block Your Babe And Purpose me 🙂💔", "Block Kardo Mujhe Warna Pyaar Hojayega💋", "I See You Inside Everyone", "That's Why I Love Everyone As More As You🤭", "Nope But, My Heart Is Falling For You My Preety Boyyy🙌✨", "Everybody Wanna Steal My Boyy😫", "আমি আপনাকে কিভাবে সাহায্য করতে পারি...? 🤔", "আদেশ করুন বস...🙂", "হুম শুনছি আমি আপনি বলুন 😐", "আমার সব কমান্ড দেখতে *help টাইপ করুন ✅", "Ji bolen ki korte pari ami apnar jonno...?", "আদেশ করুন যাহাপানা 😎", "আবার যদি আমারে বট কইয়া ডাক দেছ তাইলে তোর বিয়ে হবে না 🫤😏", "I am your personal assistant", "তুই বট তোর নানি বট 😤 তোর কত বড় সাহস তুই আমারে বট কস 😤 তোর টা খাই নাকি পড়ি যে তুই আমারে বট কস 😤", "আপনার কি চরিত্রে সমস্যা যে এতো বার আমাকে ডাকতেছেন 🤨", "ডাকছোত কেন ফাস্ট কো 😒", "তুমি কি আমাকে ডেকেছো...? 😇"
    ];

    if (["বট", "bot", "bby", "baby"].some(word => event.body.toLowerCase().startsWith(word))) {
      const randMessage = messages[Math.floor(Math.random() * messages.length)];

      const msg = {
        body: `"${randMessage}"`,
      };

      return api.sendMessage(msg, threadID, (error, info) => {
        if (!error) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            author: event.senderID,
          });
        }
      }, messageID);
    }
  },

  onReply: async function ({ api, event, args }) {
    if (event.type !== "message_reply") return;

    const nazrul = args.join(" ");
    const uid = event.senderID;

    try {
      const response = await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(nazrul)}&senderID=${uid}&font=1`);
      const replyMsg = response.data.reply;

      return api.sendMessage(replyMsg, event.threadID, (error, info) => {
        if (!error) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            author: event.senderID,
          });
        }
      }, event.messageID);
    } catch (error) {
      console.error("error:", error);
      return api.sendMessage("💔 error so sax", event.threadID, event.messageID);
    }
  }
};
