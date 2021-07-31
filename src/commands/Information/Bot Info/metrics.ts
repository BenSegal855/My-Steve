import { CommandStore, KlasaMessage } from 'klasa';
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { Message } from 'discord.js';
import { newEmbed } from '@lib/util/util';
import { Colors } from '@lib/types/enums';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Show how many times each command has been used.'
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		const embed = newEmbed()
			.setColor(Colors.YellowGreen)
			.setTitle('Command Metrics')
			.setThumbnail(this.client.user.displayAvatarURL())
			.setFooter('Last reset at')
			.setTimestamp(Date.now() - this.client.uptime)
			.setDescription(
				this.client.counters
					.sort((a, b) => b.val() - a.val())
					.map((counter, name) => `**${name}** ${counter.val()}`)
					.join('\n') || 'No metrics yet!'
			);

		return msg.channel.send(embed);
	}

}
