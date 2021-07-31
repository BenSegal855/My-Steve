import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';

export default class extends Monitor {

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { ignoreOthers: false, ignoreEdits: false });
	}

	public async run(msg: KlasaMessage): Promise<Message | void> {
		if (msg.author.id === '504432447191252993' && msg.content.includes('/g')) {
			msg.react('🥀')
			msg.react('🖤')
			msg.react('⛓')
			msg.react('🍷')
		}
	}

}
