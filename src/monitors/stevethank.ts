import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { Message, TextChannel } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';

export default class extends Monitor {

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { ignoreOthers: false, ignoreEdits: false });
	}

	public async run(msg: KlasaMessage): Promise<Message | void> {
		if ((msg.content.toLocaleLowerCase().startsWith('thank') && msg.content.toLocaleLowerCase().match(/ste/)) || msg.content.toLocaleLowerCase().startsWith('steve thank')) {
			msg.react('721911747325460501');
		}

		return;
	}

}
