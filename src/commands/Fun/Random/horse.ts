import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';
import { NAME } from '@root/config';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: `Have ${NAME} about horses`
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		const replys = [
			"wow! very good horse news!",
			"This is some of the most valuable horse information i have recieved",
			"You know Ruby, it sounds like you handled this particular horse situation in a calm and orderly manner!",
			"What good and riviting horse content!",
			"Boy, am i glad to hear about your horses and horse stuff!",
			"You sure do know how to tell a good horse story!",
			"thank you for sharing this horse info. i will use it on my next robot adventure.",
			"this horse meme and / or story is incredibly good.",
			"Linda was probably right, though.",
			"Ahaha! Very relatable horse struggles.",
			"Gosh, i know that horse-related feel.",
			"Please, tell me more about horses and horse news!",
			"telling me about horses is a great use of your time, and MINE!",
			"I'm storing this horse info in my database because i'm sure it will come in handy."
		];

		return msg.channel.send(replys[Math.floor(Math.random() * replys.length)]);
	}

}
