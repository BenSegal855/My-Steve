import { Guild, GuildAuditLogsAction, User, MessageEmbed, Collection, Client } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import moment from 'moment';
import { UserSettings } from '@lib/types/settings/UserSettings';

export function formatDate(date: number | Date, format = 'YYYY MMM Do'): string {
	return moment(date).format(format);
}

export function friendlyColonDuration(duration: number): string {
	return prettyMilliseconds(duration, { colonNotation: true, secondsDecimalDigits: 0 });
}

export function friendlyDuration(duration: number): string {
	return prettyMilliseconds(duration, { verbose: true });
}

export async function getExecutor(guild: Guild, type: GuildAuditLogsAction | number): Promise<User> {
	const logs = await guild.fetchAuditLogs({ limit: 1, type: type });
	return logs.entries.first().executor;
}

export function newEmbed(): MessageEmbed {
	return new MessageEmbed;
}

export function getFaxUsers(client: Client): Collection<string, User> {
	const faxUsers = new Collection<string, User>();

	client.users.cache.each(user => {
		if (user.settings.get(UserSettings.Fax.Number) && user.settings.get(UserSettings.Fax.Channel)) {
			faxUsers.set(user.settings.get(UserSettings.Fax.Number), user);
		}
	});

	return faxUsers;
}
