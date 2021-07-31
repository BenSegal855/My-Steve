import { CommandStore, KlasaMessage } from 'klasa';
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { Message } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Steve loves you too',
			aliases: ['ily']
		});
	}

	public async run(msg: KlasaMessage): Promise<Message | void> {
		if(msg.content.toLocaleLowerCase() === 's;i love you' || msg.content.toLocaleLowerCase() === 's;ily' ||
			msg.content.toLocaleLowerCase() === 's; i love you' || msg.content.toLocaleLowerCase() === 's; ily' ||
			msg.content.toLocaleLowerCase() === 'steve, i love you' || msg.content.toLocaleLowerCase() === 'steve, ily') {
			msg.react('739973420841959549');
			return msg.channel.send(`I love you too, ${msg.member.displayName}`);
		}
		return;
	}

}
