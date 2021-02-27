const TOKEN = ""
const Discord = require('discord.js');
const fetch = require('node-fetch');
const queryString = require('query-string');
const { prefix } = require('./package.json')
const { trimArray } = require('./Utils');
const client = new Discord.Client()

client.on('ready', () => {
  console.log('I am ready!');
});
  
client
    .on("error", console.error)
    .on("warn", console.warn)
    .on("debug", console.log)
    .on("disconnect", () => {
      console.warn("Disconnected!");
    })
    .on("reconnecting", () => {
      console.warn("Reconnecting...");
    });

    client.on("message", async message => {
      if(message.author.bot) return;
      if(message.content.startsWith(`${prefix}djs`)){
      let versions = ['9.3.1', '10.0.1', 'v11', 'stable', 'master', 'rpc', 'commando', 'akairo', 'akairo-master', 'collection']
      let versionss = []

      let args = message.content.split(" ")
      args.shift()

      let version = args[0]
      versions.forEach(version => versionss.push(`\`${version}\``))
      if(!versions.includes(version)) return message.reply('You must pick one of the following versions:\n'+versionss.join(', '))

      args.shift()
      let search = args.join(" ")

      if (version === 'v11') {
        version = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${version}.json`;
        }
        const query = queryString.stringify({src: version, q: search});
        const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?${query}`);
        const data = await res.json();
        const error = new Discord.MessageEmbed()
          .setTitle(':warning: Error!')
          .setDescription('Could not find any results!\n\nPlease make sure that you inserted the correct search terms.')
          .setColor('RED')
          .setFooter(`Automatically deletes in 3 seconds`)
          .setTimestamp()
        if(!data) return message.channel.send(error).then(m => m.delete({ timeout: 3000 }))
        message.channel.send({ embed: data });
      }

      if(message.content.startsWith(`${prefix}npm`)){

        let args = message.content.split(" ")
        args.shift()

        let package = args[0]
        package = encodeURIComponent(package.replace(/ /g, '-'))
        
        const res = await fetch(`https://registry.npmjs.com/${package}`,{
    method:"GET",
  })
  let body = await res.json();
const error = new Discord.MessageEmbed()
	.setTitle(':warning: Error! :warning:')
  .setDescription('Could not find any results!\n\nPlease make sure that you inserted the correct search terms.')
	.setColor('RED')
  .setFooter(`Automatically deletes in 3 seconds`)
  .setTimestamp()
  if(res.status != 200) return message.channel.send(error).then(m => m.delete({ timeout: 3000 }))
		
	if (body.time.unpublished) return message.reply('This package no longer exists.');
const version = body.versions[body['dist-tags'].latest];
const maintainers = trimArray(body.maintainers.map(user => user.name));
const dependencies = version.dependencies ? trimArray(Object.keys(version.dependencies)) : null;
const embed = new Discord.MessageEmbed()
.setColor('#FF0000')
.setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com/')
.setTitle(body.name)
.setURL(`https://www.npmjs.com/package/${package}`)
.setDescription(body.description || 'No description.')
.addField('❯ Version', body['dist-tags'].latest, true)
.addField('❯ License', body.license || 'None', true)
.addField('❯ Author', body.author ? body.author.name : '???', true)
.addField('❯ Creation Date', new Date(body.time.created).toDateString(), true)
.addField('❯ Modification Date', new Date(body.time.modified).toDateString(), true)
.addField('❯ Main File', version.main || 'index.js', true)
.addField('❯ Dependencies', dependencies && dependencies.length ? dependencies.join(', ') : 'None')
.addField('❯ Maintainers', maintainers.join(', '))
.setTimestamp();
message.channel.send(embed);
      }

    })
  
client.login(TOKEN);