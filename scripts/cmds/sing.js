const axios = require('axios');
const fs = require('fs');
const path = require('path');

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return base.data.api;
};

const ytApi = async () => {
  const a = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return a.data.ytdl;
};


module.exports = {
    config: {
        name: "sing",
        aliases: ["music", "audio", "play"],
        version: "1.6.9",
        author: "♡ Nazrul ♡",
        countDown: 5,
        role: 0,
        shortDescription: "Get audio from YouTube",
        longDescription: "Search or Download YouTube Audio",
        description: "Search or Download YouTube Audio",
        category: "Media",
        guide: {
            en: "{pn} Query 🎵\n {pn} link ⬇"
        }
    },
    onStart: async function ({ api, event, args }) {
        const audioQuery = args.join(" ").trim();
        const isUrl = audioQuery.startsWith('https://') || audioQuery.startsWith('http://');
        if (isUrl) {
            await this.downloadAudio(api, event, audioQuery);
        } else if (audioQuery.length > 0) {
            await this.searchAudio(api, event, audioQuery);
        } else {
            api.sendMessage("🎀 Please provide a Song Name Or YouTube url !", event.threadID, event.messageID);
        }
    },

    downloadAudio: async function (api, event, audioUrl, audioTitle, audioDuration) {
        try {
            const res = await axios.get(`${await ytApi()}/nazrul/ytDL?url=${encodeURIComponent(audioUrl)}&type=mp3&quality=128kbps`);
            const ad = res.data;
            const title = res.data.title;

            if (!ad.d_url) {
                throw new Error('Download link not found!');
            }
            const audioPath = path.resolve(__dirname, 'audio.mp3');
            const writer = fs.createWriteStream(audioPath);

            const audioStream = (await axios.get(ad.d_url, { responseType: 'stream' })).data;

            audioStream.pipe(writer);

            writer.on('finish', () => {
                api.sendMessage({
                    body: `✅✨ ♡ 𝐓𝐢𝐭𝐥𝐞: ${title}\n` +
                          `♡ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧:  ${audioDuration}\n`,
                    attachment: fs.createReadStream(audioPath)
                }, event.threadID, () => fs.unlinkSync(audioPath), event.messageID);
            });

            writer.on('error', (error) => {
                console.error('Error downloading the audio:', error);
                api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
            });

        } catch (error) {
            console.error('An error occurred:', error.message);

            if (error.response && error.response.status === 403) {
                api.sendMessage("❌ Error Please Try AGAIN Later!", event.threadID, event.messageID);
            } else {
                api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
            }
        }
    },

    searchAudio: async function (api, event, query) {
        if (!query) {
            return api.sendMessage("🎀 Please provide a Song Name!", event.threadID, event.messageID);
        }

        try {
            const msg = await api.sendMessage(`🎵 Searching Song for the [ ${query} ]✨..!`, event.threadID);

            const res = await axios.get(`${await baseApiUrl()}/nazrul/ytSearch?query=${encodeURIComponent(query)}`);
            const searchData = res.data;

            if (!searchData || searchData.length === 0) {
                throw new Error('No results found for your query!');
            }

            const maxResults = Math.min(searchData.length, 10); // Limit to 10 results
            let replyMessage = "✅ Here are the top 10 search results:\n\n";
            const attachments = [];

            for (let index = 0; index < maxResults; index++) {
                const audio = searchData[index];
                replyMessage += `♡ Auido No. #${index + 1}:\n`;
                replyMessage += `👑 Title: ${audio.title}\n`;
                replyMessage += `🔖 Duration: ${audio.timestamp}\n`;

                const thumbnailResponse = await axios.get(audio.thumbnail, { responseType: 'arraybuffer' });
                const thumbnailBuffer = Buffer.from(thumbnailResponse.data, 'binary');
                const thumbnailPath = path.join(__dirname, `thumbnail_${index + 1}.jpg`);
                fs.writeFileSync(thumbnailPath, thumbnailBuffer);
                attachments.push(fs.createReadStream(thumbnailPath));
            }

            const message = await api.sendMessage({
                body: replyMessage,
                attachment: attachments
            }, event.threadID);

            global.GoatBot.onReply.set(message.messageID, {
                commandName: this.config.name,
                author: event.senderID,
                searchData
            });
            global.GoatBot.onReplyListMessageID = message.messageID;

            // Clean up temporary thumbnail files
            attachments.forEach(stream => fs.unlinkSync(stream.path));

            await api.unsendMessage(msg.messageID);

        } catch (error) {
            console.error('An error occurred:', error.message);
            api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
        }
    },

    onReply: async function ({ api, event }) {
        try {
            const choice = parseInt(event.body.trim());
            const replyData = global.GoatBot.onReply.get(global.GoatBot.onReplyListMessageID);

            if (!replyData || isNaN(choice) || choice < 1 || choice > replyData.searchData.length) {
                return api.sendMessage("🎀 Invalid choice. Please reply with the number of the Search result.", event.threadID);
            }

            const selectedAudio = replyData.searchData[choice - 1];
            const audioUrl = selectedAudio.url;

            if (global.GoatBot.onReplyListMessageID) {
                await api.unsendMessage(global.GoatBot.onReplyListMessageID);
                delete global.GoatBot.onReplyListMessageID;
            }

            await this.downloadAudio(api, event, audioUrl, selectedAudio.title, selectedAudio.timestamp);

        } catch (error) {
            console.error('An error occurred:', error.message);
            api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
        }
    },
};
