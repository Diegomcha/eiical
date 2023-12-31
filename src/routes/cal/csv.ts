import { getList } from '../../utils/list';
import HttpError from '../../utils/HttpError';
import { Route } from '../../utils/Route';
import { getYear, getSemester, getUser } from '../../utils/parsers';
import { Env } from '../../utils/types';

export default class extends Route {
	public constructor() {
		super(/^\/cal\/\d\d-\d\d\/s\d\/UO\d+\/csv\/?$/gi);
	}

	public async execute(url: URL, env: Env): Promise<Response> {
		// Get the data
		const year = getYear(url),
			semester = getSemester(url),
			user = getUser(url);

		// Fetch list
		const list = await getList(year, semester, env);

		// Get user url
		const userUrl = list[user];
		if (!userUrl) throw new HttpError(404, 'User not found');

		// Redirect
		return Response.redirect(userUrl.slice(0, -3) + 'csv');
	}
}
