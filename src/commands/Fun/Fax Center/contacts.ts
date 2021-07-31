import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage, RichDisplay } from 'klasa';
import { Message, MessageEmbed } from 'discord.js';
import { getFaxUsers, newEmbed } from '@utils/util';
import { Colors } from '@lib/types/enums';

export default class extends SteveCommand {
	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['contact', 'whocanifax'],
			description: 'Get everyone\'s Fax numbers',
		});

	}

	public async run(msg: KlasaMessage,): Promise<Message> {
		const response = await msg.send(new MessageEmbed()
			.setDescription('Getting the phone book')
			.setColor(Colors.YellowGreen));

		const display = new RichDisplay(new MessageEmbed());

		display.addPage((embed: MessageEmbed) => embed
		.setTitle('Phone Book')
		.setThumbnail('https://cdn.discordapp.com/attachments/700378786012594268/733117912310612008/59fcd0a11ac53.png')
		.setDescription('Find your Fax recipient')
		.setColor(Colors.YellowGreen));

		const faxUsers = getFaxUsers(msg.client);

		const everyoneEmbed = newEmbed()
		.setColor(Colors.YellowGreen)
		.setTitle('FAX DIRECTORY')
		.setTimestamp(Date.now())
		.setThumbnail('https://cdn.discordapp.com/attachments/700378786012594268/733117912310612008/59fcd0a11ac53.png');

		faxUsers.forEach((user, number) => {
			display.addPage((embed: MessageEmbed) => embed
				.setTitle('Phone Book')
				.setThumbnail(user.displayAvatarURL())
				.addField(user.username, number)
				.setColor(Colors.YellowGreen));

			if (faxUsers.size <= 25) {
				everyoneEmbed.addField(user.username, number, true);
			} else {
				everyoneEmbed.setDescription(`${everyoneEmbed.description}**${user.username}**: ${number}\n`);
			}
		})

		display.addPage(everyoneEmbed);

		await display.run(response, {
			jump: false,
			time: 5* 60 * 1000,
			filter: (_, user) => user.id === msg.author.id
		});

		return response;
	}

}
