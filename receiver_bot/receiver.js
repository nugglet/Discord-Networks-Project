import Discord, { Interaction, CommandInteraction, GuildMember } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';
import dotenv from 'dotenv'
import * as utils from './utils.js'


dotenv.config()
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

// ============== GLOBAL VARIABLES ==============

const clientId = process.env.RECV_CLIENT_ID
const guildId = process.env.GUILD_ID
const token = process.env.RECV_BOT_TOKEN
const channelId = process.env.CHANNEL_ID

// ===============================================

// ============== DEFINE COMMAND BEHAVIOUR ==================================

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
    } else if (commandName == 'record') {
        // starts recording each member in voice channel


        const channel = interaction.member?.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        // const id = interaction.member.id;

        const recordable = new Set()
        for (const [key, value] of channel.members.entries()) {
            recordable.add(key)
        }

        if (connection) {
            // const dispatcher = connection.playOpusPacket('./sound.opus');

            const receiver = connection.receiver;

            recordable.forEach(function (id) {
                utils.createListeningStream(receiver, id, client.users.cache.get(id));
            })

            // const audio = connection.receiver.createStream(interaction, { mode: 'pcm', end: 'manual' });
            // audio.pipe(fs.createWriteStream('user_audio'));

            await interaction.reply({ ephemeral: false, content: 'Listening!' });
        } else {
            await interaction.reply({ ephemeral: false, content: 'Join a voice channel and then try that again!' });
        }


    } else if (commandName == 'leave') {
        // leaves channel and outputs recording + stats in bot channel
        const channel = interaction.member?.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        try {
            connection.destroy()
            recordable.clear()
            await interaction.reply({ content: `Leaving ${channel}`, ephemeral: false });
        } catch (error) {
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

client.login(process.env.RECV_BOT_TOKEN)