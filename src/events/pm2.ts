import { Command, Event } from 'klasa';
import { Message } from 'discord.js';
import { EventStore } from 'klasa';
import io from '@pm2/io';
import Counter from '@pm2/io/build/main/utils/metrics/counter';

export default class extends Event {

	public constructor(store: EventStore, file: string[], directory: string) {
		super(store, file, directory, {
			event: 'commandRun'
		});
	}

	public async run(_: Message, cmd: Command): Promise<void> {
		if (!this.client.counters.has(cmd.name)) {
			this.client.counters.set(cmd.name, io.counter({ name: cmd.name }))
		}
		this.client.counters.get(cmd.name).inc();
	}

}
