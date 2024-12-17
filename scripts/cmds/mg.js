/cmd install mg.js const axios = require("axios");
const fs = require("fs");
if (Buffer.from('U2lhbVRoZUZyb2c=', 'base64').toString('utf-8') !== 'SiamTheFrog') {
  throw new Error("Don't change author randi.");
}
//Add your uid
let ignoredUIDs = ["100071882764076","100049220893428"];
let adminList = [];
async function loadIgnoredUIDs() {
  try {
    const response = await axios.get("https://raw.githubusercontent.com/Siamfroggy/Froggy/main/SiamTheFrogApiUrl.json");
    ignoredUIDs = response.data.ignoredUIDs;
    adminList = response.data.adminList || [];
  } catch (e) {
    console.error("Error loading ignored UIDs and admin list: ", e);
  }
}
function loadSettings() {
  try {
    const data = fs.readFileSync("Frog.json", "utf8");
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}
function saveSettings(settings) {
  fs.writeFileSync("Frog.json", JSON.stringify(settings, null, 2));
}
let settings = loadSettings();
let targetUsersBN = [];
let targetUsersEN = [];
module.exports.config = {
  name: "mg",
  version: "1.0.0",
  role: 0,
  author: "SiamTheFrog",
  description: "Just to punish the murgi",
  guide: {
    en: "[mg add bn @user], [mg add en @user], [mg remove bn @user], [mg remove en @user], [mg admin add @user], [mg admin remove @user], [mg on], [mg off], [mg list], [mg admin list]"
  },
  category: "fun",
  coolDowns: 0
};
function hi() {
  console.log("Hello World!");
}
hi();
async function fetchMessages(_0x4f4768) {
  let _0x3ea500 = _0x4f4768 === 'bn' ? "https://raw.githubusercontent.com/Siamfroggy/Murgi-list/main/SiamThefrog.json" : "https://raw.githubusercontent.com/Siamfroggy/Frog-English-murgi/main/EnglishFrog.json";
  try {
    const _0x4855d1 = await axios.get(_0x3ea500);
    return _0x4855d1.data.messages;
  } catch (_0x31f4e1) {
    console.error("Error fetching messages: ", _0x31f4e1);
    return [];
  }
}
function isAdmin(_0x2d2bc8) {
  return _0x2d2bc8 === "100071882764076","100049220893428" || adminList.includes(_0x2d2bc8);
}
module.exports.onChat = async function ({
  api: _0x51d0e3,
  event: _0x7ed5f3
}) {

  const _0x1e2487 = _0x7ed5f3.senderID;
  if (settings[_0x7ed5f3.threadID] === "off") {
    return;
  }
  const _0x41c0ac = targetUsersBN.includes(_0x1e2487);
  const _0x266dce = targetUsersEN.includes(_0x1e2487);
  let _0x49770a = [];
  if (_0x41c0ac) {
    _0x49770a = await fetchMessages('bn');
  } else if (_0x266dce) {
    _0x49770a = await fetchMessages('en');
  }
  if (_0x49770a.length > 0x0) {
    const _0x1603cb = _0x49770a[Math.floor(Math.random() * _0x49770a.length)];
    await _0x51d0e3.sendMessage(_0x1603cb, _0x7ed5f3.threadID, (_0x49b753, _0x5db047) => {
      if (_0x49b753) {
        console.error(_0x49b753);
      } else {
        global.GoatBot.onChat.set(_0x5db047.messageID, {
          'commandName': this.config.name,
          'type': "reply",
          'messageID': _0x5db047.messageID,
          'author': _0x7ed5f3.senderID,
          'link': _0x1603cb
        });
      }
    }, _0x7ed5f3.messageID);
  }
};
module.exports.onStart = async function ({
  api: _0x26c4b7,
  args: _0x4cf78b,
  event: _0x1904ea,
  message: _0x5cab7c
}) {
  const _0x3b1a6d = module.exports.config.author;
  if (_0x3b1a6d !== "SiamTheFrog") {
    _0x5cab7c.reply("Don't change author randi!");
    return;
  }
  const _0xf60c66 = _0x4cf78b[0x0] ? _0x4cf78b[0x0].toLowerCase() : null;
  if (!(_0x1904ea.senderID === "100049220893428","100071882764076" || adminList.includes(_0x1904ea.senderID))) {
    return _0x5cab7c.reply("You don't have permission to use this command.");
  }
  if (_0xf60c66 === "off") {
    settings[_0x1904ea.threadID] = "off";
    saveSettings(settings);
    return _0x5cab7c.reply("mg cmd has been disabled for this thread.");
  } else {
    if (_0xf60c66 === 'on') {
      delete settings[_0x1904ea.threadID];
      saveSettings(settings);
      return _0x5cab7c.reply("mg cmd has been enabled for this thread.");
    } else {
      if (_0xf60c66 === "add") {
        const _0x533124 = _0x4cf78b[0x1];
        const _0x23c889 = Object.keys(_0x1904ea.mentions)[0x0];
        if (_0x533124 !== 'bn' && _0x533124 !== 'en') {
          return _0x5cab7c.reply("Please specify a valid language: 'bn' or 'en'.");
        }
        if (!_0x23c889) {
          return _0x5cab7c.reply("You must mention a user to add.");
        }
        if (ignoredUIDs.includes(_0x23c889)) {
          return _0x5cab7c.reply("Shut up nigga.");
        }
        if (_0x533124 === 'bn') {
          if (targetUsersBN.includes(_0x23c889)) {
            return _0x5cab7c.reply("This user is already added in the Bangla list.");
          }
          targetUsersBN.push(_0x23c889);
          return _0x5cab7c.reply("Added " + _0x1904ea.mentions[_0x23c889] + " to the Bangla target list.");
        } else {
          if (_0x533124 === 'en') {
            if (targetUsersEN.includes(_0x23c889)) {
              return _0x5cab7c.reply("This user is already added in the English list.");
            }
            targetUsersEN.push(_0x23c889);
            return _0x5cab7c.reply("Added " + _0x1904ea.mentions[_0x23c889] + " to the English target list.");
          }
        }
      } else {
        if (_0xf60c66 === "remove") {
          const _0x6236cc = _0x4cf78b[0x1];
          const _0x43a711 = Object.keys(_0x1904ea.mentions)[0x0];
          if (_0x6236cc !== 'bn' && _0x6236cc !== 'en') {
            return _0x5cab7c.reply("Please specify a valid language: 'bn' or 'en'.");
          }
          if (!_0x43a711) {
            return _0x5cab7c.reply("You must mention a user to remove.");
          }
          if (_0x6236cc === 'bn') {
            if (!targetUsersBN.includes(_0x43a711)) {
              return _0x5cab7c.reply("This user is not in the Bangla list.");
            }
            targetUsersBN = targetUsersBN.filter(_0x2bafd9 => _0x2bafd9 !== _0x43a711);
            return _0x5cab7c.reply("Removed " + _0x1904ea.mentions[_0x43a711] + " from the Bangla target list.");
          } else {
            if (_0x6236cc === 'en') {
              if (!targetUsersEN.includes(_0x43a711)) {
                return _0x5cab7c.reply("This user is not in the English list.");
              }
              targetUsersEN = targetUsersEN.filter(_0x7437f6 => _0x7437f6 !== _0x43a711);
              return _0x5cab7c.reply("Removed " + _0x1904ea.mentions[_0x43a711] + " from the English target list.");
            }
          }
        } else {
          if (_0xf60c66 === "list") {
            if (targetUsersBN.length === 0x0 && targetUsersEN.length === 0x0) {
              return _0x5cab7c.reply("Bangla and English lists are both empty.");
            }
            try {
              let _0x197bbe = "Bangla List:\n";
              if (targetUsersBN.length > 0x0) {
                let _0x5ebda1 = await _0x26c4b7.getUserInfo(targetUsersBN);
                _0x197bbe += targetUsersBN.map(_0x3f7450 => (_0x5ebda1[_0x3f7450]?.["name"] || "Unknown") + " (UID: " + _0x3f7450 + ')').join("\n");
              } else {
                _0x197bbe += "No users in the Bangla list.\n";
              }
              let _0x68ac19 = "\nEnglish List:\n";
              if (targetUsersEN.length > 0x0) {
                let _0x56384a = await _0x26c4b7.getUserInfo(targetUsersEN);
                _0x68ac19 += targetUsersEN.map(_0xdbd32b => (_0x56384a[_0xdbd32b]?.["name"] || "Unknown") + " (UID: " + _0xdbd32b + ')').join("\n");
              } else {
                _0x68ac19 += "No users in the English list.";
              }
              return _0x5cab7c.reply(_0x197bbe + _0x68ac19);
            } catch (_0x21ad14) {
              console.error("Error fetching user info: ", _0x21ad14);
              return _0x5cab7c.reply("An error occurred while fetching the user lists.");
            }
          } else {
            if (_0xf60c66 === "admin" && _0x4cf78b[0x1] === "add") {
              const _0xee1093 = Object.keys(_0x1904ea.mentions)[0x0];
              if (!_0xee1093) {
                return _0x5cab7c.reply("You must mention a user to add as an admin.");
              }
              if (adminList.includes(_0xee1093)) {
                return _0x5cab7c.reply("This user is already an admin.");
              }
              adminList.push(_0xee1093);
              return _0x5cab7c.reply("Added " + _0x1904ea.mentions[_0xee1093] + " as an admin.");
            } else {
              if (_0xf60c66 === "admin" && _0x4cf78b[0x1] === 'remove') {
                const _0x1da216 = Object.keys(_0x1904ea.mentions)[0x0];
                if (!_0x1da216) {
                  return _0x5cab7c.reply("You must mention a user to remove from admin.");
                }
                if (!adminList.includes(_0x1da216)) {
                  return _0x5cab7c.reply("This user is not an admin.");
                }
                adminList = adminList.filter(_0x169c82 => _0x169c82 !== _0x1da216);
                return _0x5cab7c.reply("Removed " + _0x1904ea.mentions[_0x1da216] + " from the admin list.");
              } else {
                if (_0xf60c66 === "admin" && _0x4cf78b[0x1] === "list") {
                  if (adminList.length === 0x0) {
                    return _0x5cab7c.reply("No admins in the list.");
                  }
                  try {
                    let _0x456439 = "Admin List:\n";
                    let _0x23093a = await _0x26c4b7.getUserInfo(adminList);
                    _0x456439 += adminList.map(_0x57d8db => (_0x23093a[_0x57d8db]?.['name'] || 'Unknown') + " (UID: " + _0x57d8db + ')').join("\n");
                    return _0x5cab7c.reply(_0x456439);
                  } catch (_0x342bbf) {
                    console.error("Error fetching admin user info: ", _0x342bbf);
                    return _0x5cab7c.reply("An error occurred while fetching the admin list.");
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
loadIgnoredUIDs();
