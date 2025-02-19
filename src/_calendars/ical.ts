import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { v5 as uuid } from 'uuid';
import config from '../util/config';

// Extend dayjs with plugins
dayjs.extend(customFormat);
dayjs.extend(utc);

// Interfaces
export interface ICalData {
	csv: string;
	year: number;
	semester: number;
	user: string;
}

export interface ICalOpts {
	alert?: number;
}

// Utility functions
function computeUuid(title: string, startDate: string): string {
	return uuid(title + startDate, config.namespace);
}

function parseCsv(str: string): string[][] {
	return str
		.split('\n')
		.slice(2, -1)
		.map((event) => event.split(',').map((field) => field.trim()));
}

function parseEvent(raw: string[], opts?: ICalOpts): string {
	const start = dayjs(`${raw[1]} ${raw[2]}`, 'DD/MM/YYYY H.mm').format(
		'YYYYMMDD[T]HHmmss'
	);
	const end = dayjs(`${raw[3]} ${raw[4]}`, 'DD/MM/YYYY H.mm').format(
		'YYYYMMDD[T]HHmmss'
	);

	return [
		'BEGIN:VEVENT',
		`UID:${computeUuid(raw[0], start)}`,
		`SUMMARY:${raw[0]}`,
		`DESCRIPTION:${raw[5]}`,
		`LOCATION:${raw[6]}`,
		`DTSTAMP:${dayjs().format('YYYYMMDD[T]HHmmss')}`,
		`DTSTART:${start}`,
		`DTEND:${end}`,
		...(opts?.alert != null
			? [
					'BEGIN:VALARM',
					`TRIGGER:-PT${opts.alert}M`,
					'ACTION:DISPLAY',
					`DESCRIPTION:${raw[0]}`,
					'END:VALARM',
				]
			: []),
		'END:VEVENT',
	].join('\r\n');
}

function parseEvents(raw: string[][], opts?: ICalOpts) {
	return raw.map((rawEvent) => parseEvent(rawEvent, opts)).join('\r\n');
}

/**
 * Generates an iCal string from the given data.
 * @param data Data to generate the iCal string from.
 * @param opts Options for the iCal generation.
 * @returns String with the iCal data.
 */
export function generateIcalString(data: ICalData, opts?: ICalOpts): string {
	const events = parseEvents(parseCsv(data.csv), opts);
	return [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//EII-CAL//eii-cal//EN',
		`NAME:[${data.year}|${data.semester}] Calendario EII de ${data.user}`,
		`X-WR-CALNAME:[${data.year}|${data.semester}] Calendario EII de ${data.user}`,
		'TIMEZONE-ID:Europe/Madrid',
		'X-WR-TIMEZONE:Europe/Madrid',
		events,
		'END:VCALENDAR',
	].join('\r\n');
}

/**
 * Headers for the response.
 */
export const HEADERS = {
	'Content-Type': 'text/calendar',
	'Content-Disposition': 'attachment; filename="cal.ics"',
};
