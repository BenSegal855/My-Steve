import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { UserSettings } from '@lib/types/settings/UserSettings';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message, Snowflake, TextChannel } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';

export default class extends SteveCommand {
	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Where do you want your faxes to go?',
			aliases: ['faxdesk', 'lornasendmyfaxesto'],
			runIn: ['text'],
			usage: '<list|set:default> (channel:faxChannel)',
			helpUsage: '*list* OR fax destination channel',
			subcommands: true
		});

		this.createCustomResolver('faxChannel', async (str, possible, msg, [action]: string[]): Promise<TextChannel> => {
			if (action === 'list') return null;
			if (!str) throw 'You must supply a valid channel.';

			const dest: TextChannel = await this.client.arguments.get('textChannel').run(str, possible, msg);
			const faxable = msg.guild.settings.get(GuildSettings.Channels.Fax) as Snowflake[];

			if (!faxable.includes(dest.id)) throw `I'm sorry but Lorna can't read faxes in ${dest}.`;

			return dest;
		});

	}

	public async list(msg: KlasaMessage): Promise<Message> {
		const avaliableGuilds = this.client.guilds.cache
			.filter(guild => guild.members.cache.has(msg.author.id))
			.filter(guild => (guild.settings.get(GuildSettings.Channels.Fax) as String[]).length > 0);

		let out = '';

		avaliableGuilds.forEach(guild => {
			out += `**${guild.name}**${guild.id === msg.guild.id
				? ''
				: ' (You must siwtch to this server to set a channel here)'}\n`
			const inboxes = guild.settings.get(GuildSettings.Channels.Fax) as String[];
			inboxes.forEach(channel => out += `<#${channel}>\n`);
			out += '\n';
		})

		return msg.channel.send(out);
	}

	public async set(msg: KlasaMessage, [channel]: [TextChannel]): Promise<Message> {
		const inboxes = msg.guild.settings.get(GuildSettings.Channels.Fax) as String[];

		if (!inboxes.includes(channel.id)) {
			return msg.channel.send(`I'm sorry but Lorna can't read faxes in ${channel}.`);
		}

		msg.author.settings.update(UserSettings.Fax.Channel, channel.id);

		const numberSet = Boolean(msg.author.settings.get(UserSettings.Fax.Number));

		return msg.channel.send(`I'll send your faxes to ${channel}. ${
			numberSet
				? ''
				: 'You don\'t have a fax number yet! You can do so with the `setNumber` command.'}`);
	}

}
