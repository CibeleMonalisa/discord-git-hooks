require('dotenv').config();
const express = require('express');
const Discord = require('discord.js');

const app = express();

const client = new Discord.Client();

app.use(express.json());

app.get('/', (request, response) => {
  return response.json({
    message: 'Hello world!',
  });
});

app.post('/branchs', (request, response) => {
  return response.send('branchs');
});

app.post('/forks', (request, response) => {
  return response.send('forks');
});

app.post('/pull-requests', (request, response) => {
  return response.send('pull-requests');
});

app.post('/stars', async (request, response) => {
  const {
    body: { action, repository, sender, starred_at: starredAt },
  } = request;

  if (action === 'created') {
    const embed = new Discord.MessageEmbed()
      .setTitle(`${sender.login} starred ${repository.name}!`)
      .setDescription(
        `Check ${sender.login} and start following! ${sender.html_url}`,
      )
      .setURL(repository.html_url)
      .setFooter(repository.full_name)
      .setThumbnail(sender.avatar_url)
      .setColor('RANDOM')
      .addFields([
        {
          name: 'Repository description',
          value: repository.description,
        },
        {
          name: 'Repository stars count',
          value: repository.stargazers_count,
        },
        {
          name: 'Repository language',
          value: repository.language,
        },
        {
          name: 'Repository open issues',
          value: repository.open_issues,
        },
      ])
      .setTimestamp(new Date(starredAt).getTime());

    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    await channel.send('@everyone 🎉 🎉 new star!! 🎉 🎉', embed);
  }
  return response.status(204);
});

app.listen(process.env.APP_PORT, () => {
  console.log(`I'm on port ${process.env.APP_PORT}`);
  client.login(process.env.DISCORD_TOKEN);
});

client.on('ready', () => {
  console.log('I am ready!');
});
