import HttpError from './HttpError';
import { Env } from './types';

export abstract class Route {
	private readonly route: RegExp;

	protected constructor(route: RegExp) {
		this.route = route;
	}

	public isRoute(url: URL): boolean {
		return url.pathname.match(this.route) != null;
	}

	public async handleRequest(url: URL, env: Env): Promise<Response> {
		try {
			// Execute the route
			return await this.execute(url, env);
		} catch (err: unknown) {
			// Handle HttpError
			if (err instanceof HttpError) return new Response(err.message, { status: err.status });
			// Let the rest of the errors be handled by the default error handler
			throw err;
		}
	}

	protected abstract execute(url: URL, env: Env): Promise<Response> | Response;
}
