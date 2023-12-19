import { Route } from '../utils/Route';

export default class extends Route {
	public constructor() {
		super(/^\/$/gi);
	}

	public execute(): Response {
		return new Response('Home');
	}
}
