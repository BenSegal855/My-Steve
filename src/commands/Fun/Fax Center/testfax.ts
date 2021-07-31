import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message, TextChannel, ColorResolvable, MessageAttachment, Util } from 'discord.js';
import { getFaxUsers, newEmbed } from '@utils/util';
import { Colors } from '@lib/types/enums';
import { UserSettings } from '@lib/types/settings/UserSettings';
import { createCanvas, loadImage } from 'canvas';

const WIDTH = 750;
const HEIGHT = WIDTH;
const HEADER_HEIGHT = 150;
const FONT_HEIGHT = 35;

export default class extends SteveCommand {
	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['tf'],
			cooldown: 60,
			permissionLevel: 10,
			cooldownLevel: 'author',
			description: 'Send a fax to someone with a fax number',
			examples: ['fax 867-5309|Thanks for being awesome!'],
			extendedHelp: 'You need a valid fax number to send a fax',
			helpUsage: 'fax number|fax message',
			usage: '<faxContent:string>'
		});
	}

	public async run(msg: KlasaMessage, [message]: [string]): Promise<Message> {
		message = Util.cleanContent(message, msg).replace(/<a?(:[a-zA-Z0-9_-]{2,}:)\d+>/g, '$1');
		const recipient = msg.author;
		const faxDest = msg.channel as TextChannel;

		const response = msg.channel.send(`Dialing 1`);

		const pages: Array<MessageAttachment> = [];

		const canvas = createCanvas(WIDTH, HEIGHT);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = recipient.settings.get(UserSettings.Fax.Background);
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		ctx.fillStyle = recipient.settings.get(UserSettings.Fax.Text);
		ctx.textAlign = 'center';
		ctx.font = '50px serif';
		ctx.fillText('From the desk of', WIDTH / 2, 50)

		ctx.font = '45px serif';
		ctx.fillText(msg.author.username, WIDTH / 2, 100)

		const pfp  = await loadImage(msg.author.displayAvatarURL({ format: 'png' }));
		ctx.save();
		ctx.translate((HEADER_HEIGHT / 2) - 50, (HEADER_HEIGHT / 2) - 50);
		ctx.beginPath();
		ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
		ctx.clip();
		ctx.drawImage(pfp, 0, 0, 100, 100);
		ctx.restore();

		ctx.translate((HEADER_HEIGHT / 2) - 25, HEADER_HEIGHT + 25);
		ctx.textAlign = 'left';
		ctx.font = `${FONT_HEIGHT - 5}px serif`;

		var i = 0, j = 0, currentHeight = HEADER_HEIGHT + 25, pageIdx = 1;

		while (message.length) {
			for (i = message.length; ctx.measureText(message.substr(0,i)).width > WIDTH - 75; i--);

			let result = message.substr(0, i);

			if (result.indexOf('\n') !== -1) {
				result = result.substr(0, result.indexOf('\n') + 1);
			} else if (i !== message.length) {
				for (j = 0; result.indexOf(" ",j) !== -1;  j = result.indexOf(" ", j) + 1 );
				result = result.substr(0, j|| result.length);
			}

			ctx.fillText(result, 0, 0);
			ctx.translate(0, FONT_HEIGHT);
			currentHeight += FONT_HEIGHT;
			message = message.substr(result.length, message.length);


			if (currentHeight >= HEIGHT - 25) {
				pages.push(new MessageAttachment(canvas.toBuffer(), `page${pageIdx++}.png`));

				ctx.resetTransform();

				ctx.fillStyle = recipient.settings.get(UserSettings.Fax.Background);
				ctx.fillRect(0, 0, WIDTH, HEIGHT);

				ctx.fillStyle = recipient.settings.get(UserSettings.Fax.Text);
				ctx.translate((HEADER_HEIGHT / 2) - 25, (HEADER_HEIGHT / 2) - 25);
				currentHeight = (HEADER_HEIGHT / 2) - 25;
			}
		}

		pages.push(new MessageAttachment(canvas.toBuffer(), `page${pageIdx++}.png`));

		if (pages.length > 10) {
			return (await response).edit('The fax machine doesn\'t have enough paper for a fax that long.')
		}

		const embed = newEmbed()
			.attachFiles(pages)
			.setImage(`attachment://page${pages.length}.png`)
			.setTimestamp(msg.createdTimestamp)
			.setColor(recipient.settings.get(UserSettings.EmbedColor) as ColorResolvable || Colors.Turquoise);
		return faxDest.send(`${recipient} fax for ya darlin`, {
			embed,
		})
			.then(async () => (await response).edit(`${recipient.username} got your fax!`))
			.catch(async (error) => {
				console.error(error);
				return (await response).edit(`Something went wrong and ${recipient.username} didn't get your fax!`);
			});
	}

}
