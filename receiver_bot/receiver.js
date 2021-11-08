const { Client, Intents, VoiceChannel } = require('discord.js');
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} from '@discordjs/voice';
const dotenv = require('dotenv')
import * as utils from 'utils.js'

dotenv.config()
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// ============== GLOBAL VARIABLES ==============

const clientId = process.env.RECV_CLIENT_ID
const guildId = process.env.GUILD_ID
const token = process.env.RECV_BOT_TOKEN

// ===============================================

// ============== DEFINE COMMAND BEHAVIOUR ==================================

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (commandName === 'server') {
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    } else if (commandName === 'user') {
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    } else if (commandName == 'join') {
        await interaction.reply('tbc');
        // https://github.com/discordjs/voice/tree/main/examples/basic
        // const channel = interaction.member?.voice.channel;

        // if (channel) {
        //     try {
        //         const connection = await connectToChannel(channel);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
    }
});


client.once('ready', () => {
    console.log("Connected as " + client.user.tag)

})

client.login(process.env.RECV_BOT_TOKEN)