import Discord, { Interaction, CommandInteraction, GuildMember} from 'discord.js';
import { joinVoiceChannel, getVoiceConnection, EndBehaviorType } from '@discordjs/voice';
import dotenv from 'dotenv'
import * as utils from './utils.js'
import pkg from '@discordjs/opus'
const { OpusEncoder } = pkg
import { pipeline, Transform } from 'node:stream';
import { FileWriter } from 'wav';

dotenv.config()
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES] });

// ============== GLOBAL VARIABLES ==============

const clientId = process.env.RECV_CLIENT_ID
const guildId = process.env.GUILD_ID
const token = process.env.RECV_BOT_TOKEN
const channelId = process.env.CHANNEL_ID

// ===============================================

class OpusDecodingStream extends Transform {
    encoder

    constructor(options, encoder) {
        super(options)
        this.encoder = encoder
    }

    _transform(data, encoding, callback) {
        this.push(this.encoder.decode(data))
        callback()
    }
}

function findUsername(userId){
    const User = client.users.cache.get(userId);
    if (User) { // Checking if the user exists.
       return User.tag;
    } else {
        message.channel.send("User not found.") // The user doesn't exists or the bot couldn't find him.
    };
}
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
        // starts recording
        const recordable = new Set()

        const channel = interaction.member?.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);

        for (const [key, value] of channel.members.entries()) {
            recordable.add(key)
        }

        if (connection) {
            // const userId = Snowflake(interaction.options.get('speaker').value)
            // recordable.add(userId);

            const receiver = connection.receiver;
            console.log(receiver)
            recordable.forEach(function (id) {
                // console.log(id)
                utils.createListeningStream(receiver, id, client.users.cache.get(id));
            })

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
            await interaction.reply({ content: `Leaving ${channel}`, ephemeral: false });
        } catch (error) {
            await interaction.reply({ content: 'Not connected to channel.', ephemeral: false });
        }
    }
});


client.once('ready', () => {
    console.log("Connected as " + client.user.tag)

})

client.login(process.env.RECV_BOT_TOKEN)