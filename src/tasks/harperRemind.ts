import { Task } from 'klasa';
import { Message, TextChannel, DMChannel } from 'discord.js';

export default class extends Task {

	public async run({ time, channel }): Promise<Message> {
		const _channel = this.client.channels.cache.get(channel);
		// eslint-disable-next-line
		return (_channel as TextChannel | DMChannel).send(`Harper, its been ${time} minutes!`);
	}

}
