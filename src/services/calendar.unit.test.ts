import moment from 'moment';
import { DateTimeEvents, buildEventsMap } from './calendar';

describe('buildEventsMap', () => {

  const day14Events = [
    "2018-06-14T09:00:00-03:00",
    "2018-06-14T09:30:00-03:00"
  ].map(i => moment(i));

  const day15Events = [
    "2018-06-15T11:00:00-03:00",
    "2018-06-15T12:00:00-03:00"
  ].map(i => moment(i));;

  const rawItems = [
    { start: { dateTime: '2018-06-14T09:00:00-03:00'} },
    { start: { dateTime: '2018-06-14T09:30:00-03:00'} },
    { start: { dateTime: '2018-06-15T11:00:00-03:00'} },
    { start: { dateTime: '2018-06-15T12:00:00-03:00'} },
  ]

  test('Should build empty map', () => {
    expect(buildEventsMap([]).size).toBe(0);
  })

  test('Should map events for 2 distinct days', () => {
    const eventMap = buildEventsMap(rawItems);
    expect(eventMap.has('2018-06-14')).toBeTruthy();
    expect(eventMap.get('2018-06-14')).toEqual(day14Events);
    expect(eventMap.has('2018-06-15')).toBeTruthy();
    expect(eventMap.get('2018-06-15')).toEqual(day15Events);
  })
})