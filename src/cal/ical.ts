import { getList } from '../utils';
import { generateIcalString } from '../utils/ical';
import { Data } from '../utils/types';

export default async function calIcal(data: Data) {
	// Fetch list
	const list = await getList(data);
	if (typeof list === 'number') return new Response(null, { status: list });

	// Get user url
	const userUrl = list[data.user];
	if (!userUrl) new Response(null, { status: 404 });

	// Fetch csv
	const listCsv = await fetch(userUrl.slice(0, -3) + 'csv');
	if (!listCsv.ok) return new Response(null, { status: listCsv.status });
	const csv = await listCsv.text();

	// Return ical
	return new Response(generateIcalString(data.user, csv), {
		headers: {
			'Content-Type': 'text/calendar',
			'Content-Disposition': `attachment; filename="plan_${data.user}.ical"`,
		},
	});
}
