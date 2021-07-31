import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';
import { NAME } from '@root/config';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['animals', 'ruby'],
			description: `Have ${NAME} tell you how dope an animal is`,
			examples: ['animals']
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		const replys = ['Yo thats a dope animal', 'Thats one majestic animal', 'I wish I was that animal',
		      'Look at that cool animal'];

		return msg.channel.send(replys[Math.floor(Math.random() * replys.length)]);
	}

}
