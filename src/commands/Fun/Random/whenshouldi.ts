import { CommandStore, KlasaMessage } from 'klasa';
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { Message } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'When should I do someting',
			aliases: ['wsi', '8helth', 'when']
		});

	}

	public async run(msg: KlasaMessage): Promise<Message> {
        const replys = ['You should do that now',
                        'Do that in the next fifteen minutes',
                        'NOW! STOP ASKING AND DO IT! DO IT NOW!',
                        'Its important and you know it, what do you think?',
                        'If you need to ask, you should probably do it'];
		return msg.channel.send(replys[Math.floor(Math.random() * replys.length)]);
	}

}
