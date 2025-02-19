import { HTTPException } from 'hono/http-exception';
import config from '../../config.json';
import { Group, UO } from '../types';

export default class Schedule {
	public readonly year: [number, number];
	public readonly semester: 1 | 2;

	public get url(): string {
		return `${config.baseUrl}/gd?y=${this.year[0]}-${this.year[1]}&t=s${this.semester}`;
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
}

export class UserSchedule {
	public readonly schedule: Schedule;
	public readonly user: UO;
	public readonly groups: Group[];

	public get url(): string {
		return `${config.baseUrl}/plan/plan.php?y=${this.schedule.year[0]}-${this.schedule.year[1]}&t=s${this.schedule.semester}&${this.groups.map((g) => `${g}=${g}`).join('&')}`;
	}
	public get csvUrl(): string {
		return `${this.url}&vista=csv`;
	}
	public get tableUrl(): string {
		return `${this.url}&vista=tabla`;
	}

	constructor(schedule: Schedule, user: UO, groups: Group[]) {
		this.schedule = schedule;
		this.user = user;
		this.groups = groups;
	}

	async fetchCsv(): Promise<string> {
		const res = await fetch(this.csvUrl);
		const body = await res.text();

		if (!res.ok || body.includes('No se puede abrir el fichero con el horario'))
			throw new HTTPException(503, {
				message: 'Schedule unavailable',
			});

		return body;
	}
}
