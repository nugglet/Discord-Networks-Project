import Discord, { Interaction, CommandInteraction, GuildMember } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection, VoiceConnection,createAudioResource , createAudioPlayer} from '@discordjs/voice';
import dotenv from 'dotenv';
import { createReadStream } from 'node:fs';
import { join } from 'path/posix';
import * as utils from './utils.js'
import ytdl from 'ytdl-core';
import { createWriteStream } from 'node:fs'

dotenv.config()

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES] });

const clientId = process.env.SENDER_BOT_CLIENT_ID
const guildId = process.env.GUILD_ID
const token = process.env.SENDER_BOT_TOKEN
const channelId = process.env.CHANNEL_ID


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName == 'join') {
        // https://github.com/discordjs/voice/tree/main/examples/basic
        const channel = interaction.member?.voice.channel;

        if (channel) {
            try {

                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guildId,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: false
                })

                await interaction.reply({ content: `Joining ${channel}`, ephemeral: false });
            } catch (error) {
                console.error(error);
            }
        }
    } else if (commandName == 'play') {
        // starts recording each member in voice channel

        const channel = interaction.member?.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        // const id = interaction.member.id;
        if (connection) {
           
            let resource = createAudioResource(createReadStream('./audio.mp3'), {
                inlineVolume : true
            });

            resource.volume.setVolume(0.2);

            console.log(join('audio.mp3'));
            
            const player = createAudioPlayer();

            connection.subscribe(player);
            player.play(resource)

            await interaction.reply({ ephemeral: false, content: 'Playing!' });
        } else {
            await interaction.reply({ ephemeral: false, content: 'Join a voice channel and then try that again!' });
        }
        

    } else if (commandName == 'leave') {
        // leaves channel and outputs recording + stats in bot channel
        const channel = interaction.member?.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        try {
            connection.destroy()
            await interaction.reply({ content: `Leaving ${channel}`, ephemeral: false });
        } catch (error) {
            console.log(error)
            await interaction.reply({ content: 'Not connected to channel.', ephemeral: false });
        }
    }
});


client.once('ready', () => {
    console.log("Connected as " + client.user.tag)

})

client.on('error', () => {
    console.log('error')
})


client.login(process.env.SENDER_BOT_TOKEN);