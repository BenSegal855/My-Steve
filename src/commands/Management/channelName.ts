import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { ChannelSuggestion } from '@lib/types/channelSuggestion';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { MessageEmbed } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Suggest a channel name change and let other members vote.',
			aliases: ['name'],
			runIn: ['text'],
			usage: '<newName:string{,32}>',
			helpUsage: 'new name'
		});
	}

	public async run(msg: KlasaMessage, [rawName]: [string]): Promise<void> {
		const name = rawName.toLocaleLowerCase().replace(/ /g, '_');

		const needed: number = msg.guild.settings.get(GuildSettings.ChannelSuggestions.Limit);
		const pollMsg = await msg.channel.send(new MessageEmbed()
			.setAuthor(`${msg.member.displayName} suggested a channel name change!`, msg.author.displayAvatarURL())
			.setTitle(`Rename this channel to #${name}?`)
			.setDescription(`React with ✅ to vote for this channel to be renamed or ❎ if you want to keep the current name.`)
			.setFooter(`${needed} more ✅${needed !== 1 ? 's' : ''} needed to change.\n` +
				`${needed} more ❎${needed !== 1 ? 's' : ''} needed to cancel.`)
			.setColor('RANDOM'));
		pollMsg.react('✅');
		pollMsg.react('❎');

		const suggestion: ChannelSuggestion = {
			name: name,
			creator: msg.author.id,
			messageId: pollMsg.id,
			channelId: msg.channel.id
		}

		msg.guild.settings.update(GuildSettings.ChannelSuggestions.Pending, suggestion, { action: 'add' })
	}

}
