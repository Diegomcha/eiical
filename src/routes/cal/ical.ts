import { getList } from '../../utils/list';
import HttpError from '../../utils/HttpError';
import { Route } from '../../utils/Route';
import { generateIcalString } from '../../utils/ical';
import { getYear, getSemester, getUser, getAlert } from '../../utils/parsers';
import { Env } from '../../utils/types';

export default class extends Route {
	public constructor() {
		super(/^\/cal\/\d\d-\d\d\/s\d\/UO\d+\/ical\/?$/gi);
	}

	public async execute(url: URL, env: Env): Promise<Response> {
		// Get the data
		const year = getYear(url),
			semester = getSemester(url),
			user = getUser(url),
			alert = getAlert(url);

		// Fetch list
		const list = await getList(year, semester, env);

		// Get user url
		const userUrl = list[user];
		if (!userUrl) throw new HttpError(404, 'User not found');

		// Fetch csv
		const listCsv = await fetch(userUrl.slice(0, -3) + 'csv');
		if (!listCsv.ok) throw new HttpError(503, 'User schedule could not be fetched from UniOvi');
		const csv = await listCsv.text();

		// Return ical
		return new Response(generateIcalString(year, semester, user, csv, alert), {
			headers: {
				'Content-Type': 'text/calendar',
				'Content-Disposition': `attachment; filename="plan_${user}.ical"`,
				'Cache-Control': 'public, max-age=43200',
			},
		});
	}
}
