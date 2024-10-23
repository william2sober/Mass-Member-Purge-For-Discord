require('dotenv').config(); // Load environment variables

const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

const TOKEN = process.env.TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const GUILD_ID = process.env.GUILD_ID;

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    const guild = client.guilds.cache.get(GUILD_ID);

    if (!guild) {
        console.log('Guild not found!');
        return;
    }

    const members = await guild.members.fetch();

    for (const [memberId, member] of members) {
        if (
            member.user.bot || // Skip bots
            member.id === OWNER_ID || // Skip server owner
            member.permissions.has('ADMINISTRATOR') // Skip members with admin permissions
        ) {
            continue;
        }

        try {
            await member.kick('Kicking all non-admin members');
            console.log(`Kicked ${member.user.tag}`);
        } catch (error) {
            console.error(`Failed to kick ${member.user.tag}:`, error);
        }
    }

    console.log('Kicking process completed.');
});

client.login(TOKEN);
