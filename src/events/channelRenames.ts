import { Event } from 'klasa';
import { Message, MessageReaction, User } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { ChannelSuggestion } from '@lib/types/channelSuggestion';
import { EventStore } from 'klasa';

export default class extends Event {

	public constructor(store: EventStore, file: string[], directory: string) {
		super(store, file, directory, {
			event: 'messageReactionAdd'
		});
	}

	public async run(reaction: MessageReaction): Promise<void> {
		const validEmotes = ['✅', '❎'];
		const msg = reaction.message;

		if (validEmotes.every(validEmote => reaction.emoji.name !== validEmote)) return;
		if (!msg.guild || msg.channel.type !== 'text') return;

		const nameSuggestons = msg.guild.settings.get(GuildSettings.ChannelSuggestions.Pending) as ChannelSuggestion[];
		const limit = msg.guild.settings.get(GuildSettings.ChannelSuggestions.Limit);

		const suggestion = nameSuggestons.find(s => s.messageId === msg.id && s.channelId === msg.channel.id);
		if (!suggestion) return;

		const changeCount = msg.reactions.cache.get('✅')?.users?.cache?.filter(user => !user.bot && user.id !== suggestion.creator)?.size ?? 0;
		const cancelCount = msg.reactions.cache.get('❎')?.users?.cache?.filter(user => !user.bot && user.id !== suggestion.creator)?.size ?? 0;

		const removeSuggestion = () => {
			validEmotes.forEach(emote => msg.reactions.cache.get(emote).remove());
			const suggestionsClone = nameSuggestons.slice();
			const index = suggestionsClone.indexOf(suggestion);
			suggestionsClone.splice(index, 1);
			msg.guild.settings.update(GuildSettings.ChannelSuggestions.Pending, suggestionsClone, { action: 'overwrite' });
		}

		if (changeCount >= limit) {
			msg.channel.edit({ name: suggestion.name }, 'Vote passed.');
			msg.edit(msg.embeds[0].setFooter('The vote passed!'));
			removeSuggestion();
		} else if (cancelCount >= limit){
			msg.edit(msg.embeds[0].setFooter('The vote was canceled!'));
			removeSuggestion();
		} else {
			const changeNeeded = limit - changeCount;
			const cancelNeeded = limit - cancelCount;
			msg.edit(msg.embeds[0].setFooter(`${changeNeeded} more ✅${changeNeeded !== 1 ? 's' : ''} needed to change.\n` +
				`${cancelNeeded} more ❎${cancelNeeded !== 1 ? 's' : ''} needed to cancel.`));
		}
	}

}
