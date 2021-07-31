import 'module-alias/register';
import { TOKENS, CLIENT_OPTIONS } from '@root/config';

import { SteveClient } from '@lib/SteveClient';
import io from '@pm2/io';

io.init({
	metrics: {
		network: true
	},
	tracing: {
		enabled: true
	}
});

const bot = new SteveClient(CLIENT_OPTIONS);

bot.login(TOKENS.BOT_TOKEN).then(() => {
	bot.setMaxListeners(25);
	console.log('Max litners:', bot.getMaxListeners());
});
