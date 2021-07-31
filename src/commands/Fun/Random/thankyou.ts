import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { MessageReaction } from 'discord.js';

export default class extends SteveCommand {

        public constructor(store: CommandStore, file: string[], directory: string) {
                super(store, file, directory, {
                        aliases: ['ty', 'thanks', 'thank', 'merci'],
                        description: 'Thank steve'
                });
        }

        public async run(msg: KlasaMessage): Promise<MessageReaction> {
                return msg.react('721911747325460501');
        }

}