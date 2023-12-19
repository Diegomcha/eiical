import { getList, getListUrl } from '../../utils/list';
import HttpError from '../../utils/HttpError';
import { Route } from '../../utils/Route';
import { getYear, getSemester, getUser } from '../../utils/parsers';
import { Env } from '../../utils/types';

export default class extends Route {
	public constructor() {
		super(/^\/\d\d-\d\d\/s\d(\/UO\d+)?\/?$/gi);
	}

	public async execute(url: URL, env: Env): Promise<Response> {
		// Get the data
		const year = getYear(url),
			semester = getSemester(url),
			user = getUser(url, true);

		// If no user is specified, redirect to the list url
		if (!user) return Response.redirect(getListUrl(year, semester));

		// Fetch list
		const list = await getList(year, semester, env);

		// Get user url
		const userUrl = list[user];
		if (!userUrl) throw new HttpError(404, 'User not found');

		// Redirect
		return Response.redirect(userUrl);
	}
}
