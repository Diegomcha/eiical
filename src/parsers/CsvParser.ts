import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
import Calendar from '../model/Calendar';
import CalEvent from '../model/CalEvent';

// Extend dayjs with plugins
dayjs.extend(customFormat);

export interface Processor<I, O> {
	process(data: I): O;
}

// Utilities

export abstract class PipedProcessor<I, T, O = T> implements Processor<I, O> {
	private readonly next: Processor<T, O>;

	constructor(next?: Processor<T, O>) {
		this.next = next ?? (new Output() as Processor<T, O>);
	}

	process(data: I): O {
		return this.next.process(this.doProcess(data));
	}

	protected abstract doProcess(data: I): T;
}

class Output<O> implements Processor<O, O> {
	process(data: O): O {
		return data;
	}
}

// Processors

export class CsvInput<O = CalEvent[]> extends PipedProcessor<
	string,
	CalEvent[],
	O
> {
	protected doProcess(csv: string): CalEvent[] {
		return (
			csv
				// Split rows
				.split('\n')
				// Remove header
				.slice(2, -1)
				.map((event) => {
					// Split fields
					const fields = event.split(',').map((field) => field.trim());
					return new CalEvent(
						fields[0],
						fields[5],
						fields[6],
						dayjs(`${fields[1]} ${fields[2]}`, 'DD/MM/YYYY H.mm').toDate(),
						dayjs(`${fields[3]} ${fields[4]}`, 'DD/MM/YYYY H.mm').toDate()
					);
				})
		);
	}
}

export class ICalTransformer<O = string> extends PipedProcessor<
	Calendar,
	string,
	O
> {
	protected doProcess(cal: Calendar): string {
		return [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//EII-CAL//eii-cal//EN',
			`NAME:${cal.title}`,
			`X-WR-CALNAME:${cal.title}`,
			`TIMEZONE-ID:${cal.timezone}`,
			`X-WR-TIMEZONE:${cal.timezone}`,
			this.parseEvents(cal),
			'END:VCALENDAR',
		].join('\r\n');
	}

	private parseEvents(cal: Calendar): string {
		return cal.events
			.map((event) =>
				[
					'BEGIN:VEVENT',
					`UID:${event.uuid}`,
					`SUMMARY:${event.title}`,
					`DESCRIPTION:${event.description}`,
					`LOCATION:${event.location}`,
					`DTSTAMP:${dayjs(event.created).format('YYYYMMDD[T]HHmmss')}`,
					`DTSTART:${dayjs(event.start).format('YYYYMMDD[T]HHmmss')}`,
					`DTEND:${dayjs(event.end).format('YYYYMMDD[T]HHmmss')}`,
					...(cal.opts?.alert != null
						? [
								'BEGIN:VALARM',
								`TRIGGER:-PT${cal.opts.alert}M`,
								'ACTION:DISPLAY',
								`DESCRIPTION:${event.title}`,
								'END:VALARM',
							]
						: []),
					'END:VEVENT',
				].join('\r\n')
			)
			.join('\r\n');
	}
}
