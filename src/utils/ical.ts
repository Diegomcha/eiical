import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { Data } from './types';

dayjs.extend(customFormat);
dayjs.extend(utc);

function parseCsv(str: string): string[][] {
	return str
		.split('\n')
		.slice(2, -1)
		.map((event) => event.split(',').map((field) => field.trim()));
}

function parseEvent(raw: string[]): string {
	const start = dayjs(`${raw[1]} ${raw[2]}`, 'DD/MM/YYYY H.mm').format('YYYYMMDD[T]HHmmss');
	const end = dayjs(`${raw[3]} ${raw[4]}`, 'DD/MM/YYYY H.mm').format('YYYYMMDD[T]HHmmss');

	return [
		'BEGIN:VEVENT',
		`UID:${uuid()}`,
		`SUMMARY:${raw[0]}`,
		`DESCRIPTION:${raw[5]}`,
		`LOCATION:${raw[6]}`,
		`DTSTAMP:${dayjs().format('YYYYMMDD[T]HHmmss')}`,
		`DTSTART:${start}`,
		`DTEND:${end}`,
		'BEGIN:VALARM',
		'TRIGGER:-PT15M',
		'ACTION:DISPLAY',
		`DESCRIPTION:${raw[0]}`,
		'END:VALARM',
		'END:VEVENT',
	].join('\r\n');
}

function parseEvents(raw: string[][]) {
	return raw.map((rawEvent) => parseEvent(rawEvent)).join('\r\n');
}

export function generateIcalString(data: Data, csvData: string): string {
	const events = parseEvents(parseCsv(csvData));
	return [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//EII-CAL//eii-cal//EN',
		`NAME:[${data.year}|${data.semester}] EII Schedule for ${data.user}`,
		`X-WR-CALNAME:[${data.year}|${data.semester}] EII Schedule for ${data.user}`,
		'TIMEZONE-ID:Europe/Madrid',
		'X-WR-TIMEZONE:Europe/Madrid',
		events,
		'END:VCALENDAR',
	].join('\r\n');
}
