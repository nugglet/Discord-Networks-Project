import Discord, { Client, Intents, Guild, User } from 'discord.js'
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    EndBehaviorType,
    VoiceReceiver
} from '@discordjs/voice';
import { createWriteStream } from 'node:fs';
import prism from 'prism-media';
import { FileWriter } from 'wav';
import { pipeline, Transform } from 'node:stream';

export function getChannel(id, timeout) {
    return this.request(RPCCommands.GET_CHANNEL, { channel_id: id, timeout });
}

export async function connectToChannel(channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: createDiscordJSAdapter(channel),
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}

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

function getDisplayName(userId, user) {
    return user ? `${user.username}_${user.discriminator}` : userId;
}

export async function createListeningStream(receiver, userId, user) {
    // console.log(receiver, userId, user)

    const filename = `./recordings/${Date.now()}-${getDisplayName(userId, user)}.ogg`;
    const encoder = new prism.opus.Encoder(16000, 1)

    console.log('entering function')
    const opusStream = receiver.subscribe(userId, {
        end: {
            duration: 1000,
        }
    })
        .pipe(new OpusDecodingStream({}, encoder))
        .pipe(new FileWriter(filename, {
            channels: 1,
            sampleRate: 16000
        }));

    console.log('subbed')

    console.log(`👂 Started recording ${filename}`);
}