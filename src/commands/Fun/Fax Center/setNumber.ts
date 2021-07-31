import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { UserSettings } from '@lib/types/settings/UserSettings';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';
import { getFaxUsers } from '@lib/util/util';

export default class extends SteveCommand {
	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['faxnumber'],
			description: 'Set your own fax number 🙀',
			usage: '<faxNumber:reg/[0-9]{3}-[0-9]{4}/>',
			helpUsage: '<faxNumber>',
			extendedHelp: 'faxNumber must be in the form of `###-####`'
		});

		this.customizeResponse('faxNumber', this.extendedHelp as string);

	}

	public async run(msg: KlasaMessage, [[faxNumber]]: [[string]]): Promise<Message> {
		const faxUsers = getFaxUsers(msg.client);

		if (faxUsers.has(faxNumber)) {
			return msg.channel.send(`It looks like ${faxNumber} is already in use.`)
		}

		msg.author.settings.update(UserSettings.Fax.Number, faxNumber);

		const channelSet = Boolean(msg.author.settings.get(UserSettings.Fax.Channel));

		return msg.channel.send(`I've updated your fax number to ${faxNumber}. ${
			channelSet
				? ''
				: 'You haven\'t told me where to send your faxes yet! You can do so with the `setDesk` command.'}`);
	}

}
