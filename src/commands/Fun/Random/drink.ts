import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message, MessageReaction, TextChannel } from 'discord.js';

export default class extends SteveCommand {
    public constructor(store: CommandStore, file: string[], directory: string) {
            super(store, file, directory, {
                    description: 'Lets get turnt',
                    cooldown: 60,
                    cooldownLevel: 'channel',
                    examples: ['drink Ben rebooted Steve'],
                    helpUsage: 'Reason for drinking',
                    usage: '<reason:string>'
            });
    }
    public async run(msg: KlasaMessage, [reason]: [string]): Promise<Message | MessageReaction> {
        // const drinkUsers = (this.client.guilds.cache.get('700378785605877820')
        //     .channels.cache.get('700378785614266404') as TextChannel)
        //     .messages.cache.get('837086900254408835')
        //     .reactions.cache.get('🍻')
		// 	.users.cache.filter(user => !user.bot)
		// 	.map(user => user.toString());

        // return msg.channel.send(`${reason} **DRINK** ${drinkUsers.join(' ')}`).then(m => m.react('🍻'));
        return msg.channel.send(`${reason} **DRINK**`).then(m => m.react('🍻'));
    }
}
