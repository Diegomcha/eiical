import { Env } from './utils/types';
import routes from './routes';

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		try {
			// Parse the url
			const url = new URL(req.url);

			// Execute the appropriate route
			for (const route of routes) {
				if (route.isRoute(url)) return await route.handleRequest(url, env);
			}

			// Route not found
			return new Response('Not found', { status: 404 });
		} catch (err) {
			// Default error handler
			//TODO: Improve
			console.error(err);
			return new Response('Internal Server Error', { status: 500 });
		}
	},
};
