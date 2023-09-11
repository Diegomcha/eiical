export const invalidPeriod = (status: number) => new Response('Invalid period', { status });
export const userNotFound = () => new Response('User not found', { status: 404 });
export const scheduleNotAvailable = (status: number) => new Response('An error ocurred fetching the schedule', { status });
