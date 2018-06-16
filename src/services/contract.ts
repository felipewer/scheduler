import { Moment } from 'moment';

export interface Appointment {
  name: string,
  company: string,
  email: string,
  date: Moment
}

export const makeAppointment = (appointment: Appointment) => {
  console.log(JSON.stringify(appointment, null, 2));
  return Promise.resolve();
}