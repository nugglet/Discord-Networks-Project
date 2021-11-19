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
    VoiceReceiver,
    generateDependencyReport
} from '@discordjs/voice';
import { createWriteStream } from 'node:fs';
import pkg from '@discordjs/opus'
const { OpusEncoder } = pkg
import prism, { opus } from 'prism-media';
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
    const opusStream = receiver.subscribe(userId, {
		end: {
			behavior: EndBehaviorType.AfterSilence,
			duration: 100,
		},
        autoDestroy: true,
	});

    console.log(receiver)

	const oggStream = new prism.opus.OggLogicalBitstream({
		opusHead: new prism.opus.OpusHead({
			channelCount: 2,
			sampleRate: 48000,
		}),
		pageSizeControl: {
			maxPackets: 10,
		},
	});

	const filename = `./recordings/${Date.now()}-${getDisplayName(userId, user)}.ogg`;

	const out = createWriteStream(filename, {autoClose: true});

    console.log(`👂 Started recording ${filename}`);

    pipeline(opusStream, oggStream, out, (err) => {
        console.log(err)
		if (err) {
			console.warn(`❌ Error recording file ${filename} - ${err.message}`);
		} else {
			console.log(`✅ Recorded ${filename}`);
		}
	})
}

export function reportCallStats(channel, interaction) {

    var report = `Call Statistics:\nNumber of Members: ${channel.members.size}\nChannel Bitrate: ${channel.bitrate}\nRTC Region: ${channel.rtcRegion}`
    return report

}
