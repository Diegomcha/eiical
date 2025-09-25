import { HTTPException } from 'hono/http-exception';
import config from '../../config.json';
import { Group, UO } from '../types';
import Calendar, { CalendarOpts } from './Calendar';

export default class Schedule {
	readonly year: [number, number];
	readonly semester: 1 | 2;

	get url(): string {
		return `${config.baseUrl}/gd?y=${this.year[0].toString()}-${this.year[1].toString()}&t=s${this.semester.toString()}`;
	}

	constructor(year: number, semester: 1 | 2) {
		const year1 = Number(year.toString().slice(-2));
		this.year = [year1, (year1 + 1) % 100];

		this.semester = semester;
	}

	async fetchUserSchedules(): Promise<Map<`UO${number}`, UserSchedule>> {
		const res = await fetch(this.url);
		const body = await res.text();

		if (!res.ok || body.includes('Error: No se puede leer'))
			throw new HTTPException(503, {
				message: 'Schedule unavailable',
			});

		return new Map(
			body.matchAll(/s[12]&(.+)&vista=web">(UO\d+)/gi).map((match) => {
				const uo = match[2].toUpperCase() as UO;
				const schedule = new UserSchedule(
					this,
					uo,
					match[1].split('&').map((g) => g.split('=')[0]) as Group[]
				);
				return [uo, schedule];
			})
		);
	}

	getCustomSchedule(groups: Group[]): UserSchedule {
		return new UserSchedule(this, 'UO0', groups);
	}
}

export class UserSchedule {
	readonly schedule: Schedule;
	readonly user: UO;
	readonly groups: Group[];

	private get url(): string {
		return `${config.baseUrl}/plan/plan.php?y=${this.schedule.year[0].toString()}-${this.schedule.year[1].toString()}&t=s${this.schedule.semester.toString()}&${this.groups.map((g) => `${g}=${g}`).join('&')}`;
	}
	get webUrl(): string {
		return `${this.url}&vista=web`;
	}
	get csvUrl(): string {
		return `${this.url}&vista=csv`;
	}
	get tableUrl(): string {
		return `${this.url}&vista=tabla`;
	}

	constructor(schedule: Schedule, user: UO, groups: Group[]) {
		this.schedule = schedule;
		this.user = user;
		this.groups = groups;
	}

	async fetchCalendar(opts?: CalendarOpts): Promise<Calendar> {
		const res = await fetch(this.csvUrl);
		const csv = new TextDecoder('windows-1252').decode(await res.arrayBuffer()); // The server uses Windows-1252 encoding

		if (!res.ok || csv.includes('No se puede abrir el fichero con el horario'))
			throw new HTTPException(503, {
				message: 'Schedule unavailable',
			});

		return Calendar.fromCsv(
			`[${this.schedule.year.join('-')}|${this.schedule.semester.toString()}] Calendario EII de ${this.user}`,
			`Calendario generado a partir del horario oficial de la Escuela de Ingeniería Informática de la Universidad de Oviedo para el usuario ${this.user} en el curso ${this.schedule.year.join('-')} semestre ${this.schedule.semester.toString()}.`,
			this.csvUrl,
			csv,
			opts
		);
	}
}
