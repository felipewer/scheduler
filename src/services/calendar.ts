import { Moment } from 'moment';
import moment from 'moment';

const CALENDAR_ID = process.env.CALENDAR_ID;
const API_KEY = process.env.API_KEY;

const calendarAPI = 'https://www.googleapis.com/calendar/v3';
const eventsPath = `/calendars/${CALENDAR_ID}/events`;
const fields = `fields=items(id,summary,start)`;
const key = `key=${API_KEY}`

const buildUrl = (timeMin: string) => {
  return `${calendarAPI}${eventsPath}?${fields}&timeMin=${timeMin}&${key}`;
}

export const buildEventsMap = (dateTimeItems: Array<any>): Map<string, Moment[]> => {
  const dateTimeEvts = new Map<string, Moment[]>();
  dateTimeItems.forEach(item => {
    const dt = moment(item.start.dateTime);
    const key = dt.format('YYYY-MM-DD');
    if (dateTimeEvts.has(key)) {
      dateTimeEvts.get(key).push(dt);
    } else {
      dateTimeEvts.set(key, [ dt ]);
    }
  })
  return dateTimeEvts;

}

export const loadEvents = (startDate: Moment = moment()) => {
  return fetch(buildUrl(startDate.format()))
    .then(res => res.json())
    .then(res => buildEventsMap(res.items));
}
