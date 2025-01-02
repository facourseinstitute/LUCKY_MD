const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNEVxYW44MXZpUXdkU29ib2tTSUZBbmRaRzZhejQvVTlJSW5mLzYxUTdWVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoici9OeStCK1B5OFMvcmZ2dXI1SUFIK21Ea0FKSS9uNHZHeEhJZGF0b2FsQT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLSXFQbFMxMGh5N0NJbEZHUjdGU1RWbFZiR0x1dFQ5bWF2U0xjcHhUeUZzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJKcnZtMEhVMkhROVVkUFJzWmNpdDM3ZXp3RUhOZS9uL3l1SjRQMDBjT0RFPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IklJTUpCZEJkSmFTOG16NmN3QmczdnNkOW9qYkZWMkNzTmxVaGRZdFpqSDg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InAyaFprQ2w0dzM2VE45NTdBc0h5Rk1xdGE5b1ljMkVXMFo5cDd4OW9PQTg9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0Fmd3c5K0lVd3kxdzNuelY4RjU4ZGVSdmkrVnZCR3pmYU1Zc2VkVi9Gaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSTkrSTd0VForSndSZU5ZZ0puWTA4eUNidzVqaVhnSHRtdXlrSk5IaWlSQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IktXem96RTczZE0yQklCRlBjMTVjVmp1VkhoTUVqS1YvQzAvMkJMMTdaMmU0N0dRZjhPa1VYQkJaYlcwczdaMGhzNzFUVmsvZGdQRDB4cUNMTU9oQUN3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NzQsImFkdlNlY3JldEtleSI6Ik5Dc1BSbUkvc1lKcDRCSVZYbjJJU2Q2Mm45UFVKQ21VUHdmWFFCNkU4Rnc9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IlliWlNWRm1qUzRHMnZ5VFdHX3NmLWciLCJwaG9uZUlkIjoiODkyM2Y1MTYtY2M2ZC00ZTk1LWJmOWQtYTE0MjU4MzNiYzMwIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjM2cHlZNDRsMXZxLzZvbjZBZk9oNlVXWndpQT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHUHhXL0xuU3ZFcC94Z01LdUlRYlhIeVhCMWc9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiQlQxS002OTYiLCJtZSI6eyJpZCI6IjkyMzEwNzI2MjE3NjoyMUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSXZtdmFJSEVQTC9ycnNHR0FNZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiWGozL0xYTFB5a1lCZEVLUlovNXV5anhENTY4TjVSemRQR2VrWWFscWlEUT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiQnB6QW80bE4rVmtJMTFOdW5OVHh3UlA5S0oveHBYWTFhanZkeTY5REJ6K2habmpia2dTakxEdnJMblAwWHFJVU9RaTNENC96VCtjSFJ2eFJjUUFxQ3c9PSIsImRldmljZVNpZ25hdHVyZSI6InpxZWNydzJqb1hDV0ZiSnU5REtLeGxCNzVlK2hnMnVsRU1YWjFpck5WbWJzUnllK0J4NWxnOVNFTDZNUmIzczdCWGRZVjBnbnhZMHpqSU11eGFnL0JRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTIzMTA3MjYyMTc2OjIxQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlY0OS95MXl6OHBHQVhSQ2tXZitic284UStldkRlVWMzVHhucEdHcGFvZzAifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzUxMTQ3NTF9',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "𝑲𝑰𝑵𝑮 𝑨𝑸𝑰𝑩 ☠️👑",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " 923107262176",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'LUCKY_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '5' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    ANTICALL : process.env.ANTICALL || 'yes',
                  AUTO_REACT : process.env.AUTO_REACT || 'yes',
                  AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
                  AUTO_REPLY : process.env.AUTO_REPLY || 'yes',
                  AUTO_READ : process.env.AUTO_READ || 'yes',
                  AUTO_SAVE_CONTACTS : process.env.AUTO_SAVE_CONTACTS || 'no',
                  AUTO_REJECT_CALL : process.env.AUTO_REJECT_CALL || 'yes',
                  AUTO_BIO : process.env.AUTO_BIO || 'yes',
                  AUDIO_REPLY : process.env.AUDIO_REPLY || 'yes',
                  AUTO_TAG_STATUS : process.env.AUTO_TAG_STATUS || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
