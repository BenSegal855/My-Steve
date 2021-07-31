import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { Message, Invite } from 'discord.js';

export default class extends Monitor {

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { ignoreOthers: false, ignoreEdits: false, ignoreBots: false});
	}

	public async run(msg: KlasaMessage): Promise<Message | void> {
		if (msg.author.id !== '744764826286293043') return;

		const content = msg.content.toLocaleLowerCase();

		if(content.startsWith('steven, remind me in ')) {
			const time = parseInt(content.split(' ')[content.split(' ').length - 1]);
			this.remind(msg, time);
		}

		if(msg.channel.id === '746904997337497750') {
			this.openDm(msg, msg.content);
		}

		return;
	}

	private async remind(msg: KlasaMessage, duration: number): Promise<Message> {
		const reminderChannel = msg.channel.id;

		await this.client.schedule.create('harperRemind', Date.now() + duration * 60 * 1000, { data: { channel: reminderChannel, time: duration}});

		return msg.channel.send(`Okay Harper, I'll remind you in ${duration} minutes.`);
	}

	private async openDm(msg: KlasaMessage, snowflake: string): Promise<Message>{
		const user = this.client.users.cache.get(snowflake);
		if (user) {
			const invite = msg.guild.systemChannel.createInvite({ maxUses: 1, unique: true});
			return user.send(`🎉Come join the party in  https://discord.gg/${(await invite).code} 🎉`)
		}
		return msg.channel.send('Invalid ID');
	}
}
