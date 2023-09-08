import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

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
		'SEQUENCE:0',
		`SUMMARY:${raw[0]}`,
		`DESCRIPTION:${raw[5]}`,
		`LOCATION:${raw[6]}`,
		`DTSTAMP:${dayjs().format('YYYYMMDD[T]HHmmss')}`,
		`DTSTART:${start}`,
		`DTEND:${end}`,
		'END:VEVENT',
	].join('\r\n');
}

function parseEvents(raw: string[][]) {
	return raw.map((rawEvent) => parseEvent(rawEvent)).join('\r\n');
}

export function generateIcalString(user: string, csvData: string): string {
	const events = parseEvents(parseCsv(csvData));
	return [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//EII-CAL//eii-cal//EN',
		`NAME:EII Schedule for ${user}`,
		`X-WR-CALNAME:EII Schedule for ${user}`,
		'TIMEZONE-ID:Europe/Madrid',
		'X-WR-TIMEZONE:Europe/Madrid',
		events,
		'END:VCALENDAR',
	].join('\r\n');
}
