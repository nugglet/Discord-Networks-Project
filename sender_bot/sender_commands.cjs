const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv')

dotenv.config()

// ============== GLOBAL VARIABLES ==============

const clientId = process.env.SENDER_BOT_CLIENT_ID
const guildId = process.env.GUILD_ID
const token = process.env.SENDER_BOT_TOKEN

// ===============================================

const commands = [
    new SlashCommandBuilder().setName('join').setDescription('Joins the active voice channel and starts playing.'),
    new SlashCommandBuilder().setName('play').setDescription('Play music').addStringOption(option => option.setName('name').setDescription('Enter new filename').setRequired(true)).addIntegerOption(option => option.setName('bitrate').setDescription('Enter new bitrate').setRequired(true)),
    new SlashCommandBuilder().setName('leave').setDescription('Leaves channel')
]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);