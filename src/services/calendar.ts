import { Moment } from 'moment';
import moment from 'moment-timezone';

export type EventMap = Map<string, Set<string>>;

const buildUrl = (calendarId: string, timeMin: string, apiKey: string) => {
  const calendarAPI = 'https://www.googleapis.com/calendar/v3';
  const eventsPath = `/calendars/${calendarId}/events`;
  const fields = `fields=items(id,start)`;
  const key = `key=${apiKey}`
  return `${calendarAPI}${eventsPath}?${fields}&timeMin=${timeMin}&${key}`;
}

/** Build a Map structure to organize google calendar dateTime event items 
 * into sub-arrays mapped by their date strings (YYYY-MM-DD). Also converts the
 * events' timezone to the local timezone.
 * 
 * @param dateTimeItems 
 * @param calendarTimeZone 
 */
const buildEventsMap = (
  dateTimeItems: any[] = [],
  calendarTimeZone: string
): EventMap => {
  const dateTimeEvts = new Map<string, Set<string>>();
  dateTimeItems.forEach(item => {
    const dt = moment.tz(item.start.dateTime, calendarTimeZone);
    const localDt = dt.tz(moment.tz.guess());
    const key = localDt.format('YYYY-MM-DD');
    if (dateTimeEvts.has(key)) {
      dateTimeEvts.get(key).add(localDt.format());
    } else {
      dateTimeEvts.set(key, new Set<string>([ localDt.format() ]));
    }
  })
  return dateTimeEvts;
}

const loadEvents = (
  calendarId: string,
  apiKey: string,
  startDate: Moment = moment()
) => {
  return fetch(buildUrl(calendarId, startDate.format(), apiKey))
    .then(res => res.json())
    .then(res => buildEventsMap(res.items, res.timeZone));
}

export default { buildEventsMap, loadEvents };
