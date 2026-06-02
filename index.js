const env = require("dotenv");
const { REST, Routes, Client, Events, GatewayIntentBits, Options, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, MessageFlags, SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require("path");
const beautify = require('beautify');

fs.writeFileSync("version",(parseFloat(fs.readFileSync("version",{
    encoding:"utf8"
}))+1).toString(),{
            encoding:"utf8"
        })

const pino = require('pino')

const TRANS = pino.transport({
  targets: [
    {
      level: 'trace',
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    },
    {
      level: 'trace',
      target: 'pino-pretty',
      options: {
        colorize: false,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        destination: (process.env.test=="yes"?'./test.log':'./app.log')
      }
    }
  ]
});
const logger = pino({
  level: 'trace',
}, TRANS);



const testers = new Set()

fs.readFileSync("testers.list",{encoding:"utf8"}).split("\n").forEach((val)=>{
    logger.info(val)
    testers.add(val)
})
let datafile = (process.env.test=="yes"?'./data_test.json':'./data.json')
let data = JSON.parse(fs.readFileSync(datafile))
const funcs = {
    save_data: (daty) => {
        fs.writeFileSync(datafile, beautify(JSON.stringify(daty), { format: 'json' }))
    },
    log:(thing)=>{logger.info(thing)}
}

env.config({ path: './.env' });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildIntegrations
    ]
});

client.on(Events.ClientReady, async (readyClient) => {
    logger.info(`Logged in as ${readyClient.user.tag}!`);
});

client.commands = new Collection();

let commands = []

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            logger.info(`Registered command ${command.data.name}`)
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
let rest
if (process.env.test=="yes") {
    rest = new REST({ version: '10' }).setToken(process.env.TEST_TOKEN);
} else {
rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
}
try {
    logger.info('Started refreshing application (/) commands.');
    if (process.env.test=="yes") {
        rest.put(Routes.applicationCommands(process.env.TEST_CLIENT_ID), { body: commands });
    } else {
    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    }

    logger.info('Successfully reloaded application (/) commands.');
} catch (error) {
    logger.error(error);
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return
    };
    if (process.env.test=="yes") {
        if (!testers.has(interaction.user.username)) {
            interaction.reply(`u arent a tester sowwy`)
            return;
        }
    }

    const command = interaction.client.commands.get(interaction.commandName);

    let taxi = ``
    let wawa = interaction.options.data
    wawa.forEach((val)=>{
        taxi += `"${val.name}":${val.value},`
    })

    logger.info(`${interaction.user.username} used "${interaction.commandName}" with arguments "${taxi}"`)

    if (!command) {
        logger.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, data, funcs,client.user.id);
    } catch (error) {
        logger.info(error)
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
});
if (process.env.test=="yes") {
    client.login(process.env.TEST_TOKEN)
} else {
    client.login(process.env.TOKEN)
}