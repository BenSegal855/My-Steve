import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { PermissionLevels } from '@lib/types/enums';
import { CommandStore, KlasaMessage } from 'klasa';
import { TextChannel, GuildChannel } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['everywhere'],
			runIn: ['text'],
			description: 'I am everywhere',
			permissionLevel: PermissionLevels.OWNER
		});
	}

	public async run(msg: KlasaMessage) {
        (msg.channel as GuildChannel).parent.children.array().forEach(channel => {
            if(channel.type == 'text') {
				(channel as TextChannel).send('Ben is everywhere');
			}
        });
	}

}
