import { Route } from '../utils/Route';
import { GITHUB_URL } from '../utils/constants';

export default class extends Route {
	public constructor() {
		super(/^\/$/gi);
	}

	public execute(): Response {
		return Response.redirect(GITHUB_URL);
	}
}
