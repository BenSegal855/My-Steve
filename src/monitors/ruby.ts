import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';

export default class extends Monitor {

	private USER_ID = '504432447191252993';
	private GUILD_ID = '802330376059355166';
	private ROLES = ['802332679831289856'];
	private EMOTES = ['🥀', '🖤', '⛓', '🍷']

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, {
			ignoreOthers: false,
			allowedTypes: ['GUILD_MEMBER_JOIN']
		});
	}

	public async run(msg: KlasaMessage): Promise<Message | void> {
		if (msg.author.id !== this.USER_ID || msg.guild.id !== this.GUILD_ID) return;

		this.ROLES.forEach(r => msg.member.roles.add(r));
		this.EMOTES.forEach(e => msg.react(e));
	}

}
