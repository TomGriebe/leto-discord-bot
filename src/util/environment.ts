require("dotenv").config({ quiet: true });

export const applicationId = process.env.APPLICATION_ID || "";
export const token = process.env.TOKEN || "";
export const guildId = process.env.GUILD_ID || "";
