import Discord, { Client, Intents, Guild, User } from 'discord.js'
import {
    joinVoiceChannel,
    entersState,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import pkg from '@discordjs/opus';


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

function getDisplayName(userId, user) {
    return user ? `${user.username}_${user.discriminator}` : userId;
}
