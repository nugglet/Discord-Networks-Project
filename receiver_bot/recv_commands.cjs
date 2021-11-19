const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv')

dotenv.config()

// ============== GLOBAL VARIABLES ==============

const clientId = process.env.RECV_CLIENT_ID
const guildId = process.env.GUILD_ID
const token = process.env.RECV_BOT_TOKEN

// ===============================================

const commands = [
    new SlashCommandBuilder().setName('join').setDescription('Joins the active voice channel and starts recording.'),
    new SlashCommandBuilder().setName('record').setDescription('Records voice activity.'),
    new SlashCommandBuilder().setName('leave').setDescription('Leaves channel and reports call stats'),
    new SlashCommandBuilder().setName('setbitrate').setDescription('Sets channel bitrate if user is connected to a voice channel.')
        .addIntegerOption(option => option.setName('bitrate').setDescription('Enter new bitrate').setRequired(true))
]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
