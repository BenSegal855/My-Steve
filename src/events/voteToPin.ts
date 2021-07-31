import { Event } from 'klasa';
import { Message, MessageAttachment, MessageEmbed, MessageReaction, User } from 'discord.js';
import { EventStore } from 'klasa';
import moment from 'moment';

export default class extends Event {

	public constructor(store: EventStore, file: string[], directory: string) {
		super(store, file, directory, {
			event: 'messageReactionAdd'
		});
	}

	public async run(reaction: MessageReaction, user: User): Promise<Message | void> {
		if (reaction.emoji.name !== '📌') return;
		if (user.bot) return;

		if (reaction.count >= 3 && !reaction.message.pinned) {
			return reaction.message.pin()
				.catch(error => {
					console.error(error);
					const embed = new MessageEmbed();

					embed.setTitle(error.name ? error.name : error.toString());

					if (error.message) {
						if (error.message.length < 1000) {
							embed.setDescription(`\`\`\`\n${error.message}\`\`\``);
						} else {
							embed.setDescription(`Full error message too big\n\`\`\`js\n${error.message.slice(0, 950)}...\`\`\``);
						}
					}

					if (error.stack) {
						if (error.stack.length < 1000) {
							embed.addField('Stack Trace', `\`\`\`js\n${error.stack}\`\`\``, false);
						} else {
							embed.addField('Stack Trace', 'Full stack too big, sent to file.', false);
							embed.attachFiles([sendToFile(error.stack, 'js', 'error', true)]);
						}
					}
					embed.setTimestamp();
					embed.setColor('RED');

					reaction.message.channel.send('🔥 <@!465668689920917534> 🔥', embed);
				});
		}
	}

}

function sendToFile(input: string, filetype = 'txt', filename: string = null, timestamp = false): MessageAttachment {
	const time = moment().format('M-D-YY_HH-mm');
	filename = `${filename}${timestamp ? `_${time}` : ''}` || time;
	return new MessageAttachment(Buffer.from(input.trim()), `${filename}.${filetype}`);
}
