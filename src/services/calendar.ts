import { Moment } from 'moment';
import moment from 'moment-timezone';

const buildUrl = (calendarId: string, timeMin: string, apiKey: string) => {
  const calendarAPI = 'https://www.googleapis.com/calendar/v3';
  const eventsPath = `/calendars/${calendarId}/events`;
  const fields = `fields=items(id,start)`;
  const key = `key=${apiKey}`
  return `${calendarAPI}${eventsPath}?${fields}&timeMin=${timeMin}&${key}`;
}

export const buildEventsMap = (
  dateTimeItems: any[] = [],
  timeZone: string
): Map<string, Moment[]> => {
  
  const dateTimeEvts = new Map<string, Moment[]>();
  dateTimeItems.forEach(item => {
    const dt = moment.tz(item.start.dateTime, timeZone);
    const localDt = dt.tz(moment.tz.guess());
    const key = localDt.format('YYYY-MM-DD');
    if (dateTimeEvts.has(key)) {
      dateTimeEvts.get(key).push(localDt);
    } else {
      dateTimeEvts.set(key, [ localDt ]);
    }
  })
  return dateTimeEvts;

}

export const loadEvents = (
  calendarId: string,
  apiKey: string,
  startDate: Moment = moment()
) => {
  return fetch(buildUrl(calendarId, startDate.format(), apiKey))
    .then(res => res.json())
    .then(res => buildEventsMap(res.items, res.timeZone));
}
