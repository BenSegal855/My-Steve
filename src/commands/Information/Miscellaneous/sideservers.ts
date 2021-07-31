import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Sideservers, Colors } from '@lib/types/enums';
import { oneLine } from 'common-tags';
import { Message } from 'discord.js';
import { newEmbed } from '@utils/util';
import { TUATARIA } from '@root/config';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Get invite links to Tuataria\'s sideservers.',
			examples: ['sideservers']
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		const embed = newEmbed()
			.setTitle('Official Sideservers')
			.setDescription(oneLine`This wacky club  has 3 official sideservers: Ed's Batcave (for all your video game discussion needs),
				Ren's Hunt server (for hunts and stuff), and Ruby's Good server (For all your Ruby needs). You can find links to them
				below. Click or tap the emojis!`)
			.setColor(Colors.BrightBlue)
			.addFields([
				{ name: "Ed'sBat Cave", value: `[📚](${Sideservers.BIBLIOTARIA})`, inline: true },
				{ name: "Ren's Crazy Hunts", value: `[🎮](${Sideservers.GAMATARIA})`, inline: true },
				{ name: "Ruby's Good Server", value: `[🌂](${Sideservers.HOGWARTARIA})`, inline: true }
			]);

		return msg.channel.send(embed);
	}

	public async init(): Promise<this | void> {
		if (!TUATARIA) return this.disable();
	}

}
