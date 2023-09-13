import { getList } from '../utils';
import { invalidPeriod, scheduleNotAvailable, userNotFound } from '../utils/errors';
import { generateIcalString } from '../utils/ical';
import { Data } from '../utils/types';

export default async function calIcal(data: Data) {
	// Fetch list
	const list = await getList(data);
	if (typeof list === 'number') return invalidPeriod(list);

	// Get user url
	const userUrl = list[data.user];
	if (!userUrl) return userNotFound();

	// Fetch csv
	const listCsv = await fetch(userUrl.slice(0, -3) + 'csv');
	if (!listCsv.ok) return scheduleNotAvailable(listCsv.status);
	const csv = await listCsv.text();

	// Return ical
	return new Response(generateIcalString(data, csv), {
		headers: {
			'Content-Type': 'text/calendar',
			'Content-Disposition': `attachment; filename="plan_${data.user}.ical"`,
		},
	});
}
