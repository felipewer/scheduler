import moment from "moment-timezone";
import { getMomentAt, nextAvailableTime } from '../../src/services/date';


describe('Get moment at specific date, hour and timezone', () => {

  test('Should return moment at 6AM America/Manaus', () => {
    const hour = { hour: 6, timezone: 'America/Manaus' };
    const dateTime = getMomentAt(hour);
    expect(dateTime.hours()).toBe(6);
    expect(dateTime.tz()).toBe('America/Manaus');
  });

  test('Should return moment at 7AM America/Sao_Paulo', () => {
    const hour = { hour: 7, timezone: 'America/Sao_Paulo' };
    const dateTime = getMomentAt(hour);
    expect(dateTime.hours()).toBe(7);
    expect(dateTime.tz()).toBe('America/Sao_Paulo');
  });

  test('Should return moment on August 14, 2018', () => {
    const hour = { hour: 7, timezone: 'America/Sao_Paulo' };
    const dateTime = getMomentAt(hour, moment('2018-08-14'));
    expect(dateTime.format()).toBe('2018-08-14T07:00:00-03:00');

  });

  test('Should be at the same hour', () => {
    const date = moment();
    const hour6 = { hour: 6, timezone: 'America/Manaus' };
    const hour7 = { hour: 7, timezone: 'America/Sao_Paulo' };
    const manaus6AM = getMomentAt(hour6, date);
    const saoPaulo7AM = getMomentAt(hour7, date);
    expect(manaus6AM.isSame(saoPaulo7AM, 'hour')).toBeTruthy();
    expect(manaus6AM.unix()).toEqual(saoPaulo7AM.unix());
  });

});

describe('Get next available time', () => {

  test('Should return a moment 4 hours in the future', () => {
    const now = moment('2018-08-14').tz('America/Sao_Paulo').startOf('day');
    const events = new Map<string,Set<string>>();
    const minHour = { hour: 0, timezone: 'America/Sao_Paulo' };;
    const maxHour = { hour: 22, timezone: 'America/Sao_Paulo' };
    const nextTime = nextAvailableTime(events, minHour, maxHour, now);
    expect(nextTime.diff(now, 'hours')).toBe(4);
  });

  test('Should return a moment >= the minimum hour', () => {
    const now = moment('2018-08-14').tz('America/Sao_Paulo').startOf('day');
    const events = new Map<string,Set<string>>();
    const minHour = { hour: 7, timezone: 'America/Sao_Paulo' };;
    const maxHour = { hour: 22, timezone: 'America/Sao_Paulo' };
    const nextTime = nextAvailableTime(events, minHour, maxHour, now);
    expect(nextTime.isSameOrAfter('2018-08-14T07:00:00-03:00')).toBeTruthy();
  });

  test('Should return a moment < the maximum hour', () => {
    const now = moment('2018-08-14').tz('America/Sao_Paulo').startOf('day');
    const events = new Map<string,Set<string>>();
    const minHour = { hour: 7, timezone: 'America/Sao_Paulo' };;
    const maxHour = { hour: 22, timezone: 'America/Sao_Paulo' };
    const nextTime = nextAvailableTime(events, minHour, maxHour, now);
    expect(nextTime.isBefore('2018-08-14T22:00:00-03:00')).toBeTruthy();
  });

  test('Should return a moment >= the minimum hour on the next weekday', () => {
    const now = moment('2018-08-18').tz('America/Sao_Paulo').startOf('day');
    const events = new Map<string,Set<string>>();
    const minHour = { hour: 7, timezone: 'America/Sao_Paulo' };;
    const maxHour = { hour: 22, timezone: 'America/Sao_Paulo' };
    const nextTime = nextAvailableTime(events, minHour, maxHour, now);
    expect(nextTime.isSameOrAfter('2018-08-20T07:00:00-03:00')).toBeTruthy();
  });

  test('Should return a moment < the maximum hour on the next weekday', () => {
    const now = moment('2018-08-17').tz('America/Sao_Paulo').startOf('day');
    const events = new Map<string,Set<string>>();
    const minHour = { hour: 7, timezone: 'America/Sao_Paulo' };;
    const maxHour = { hour: 22, timezone: 'America/Sao_Paulo' };
    const nextTime = nextAvailableTime(events, minHour, maxHour, now);
    expect(nextTime.isBefore('2018-08-20T22:00:00-03:00')).toBeTruthy();
  });

  test('Should return a moment not already taken', () => {
    const { hour, timezone } = { hour: 7, timezone: 'America/Sao_Paulo'};
    const taken = new Set<string>([
      '2018-08-14T11:00:00-03:00',
      '2018-08-14T12:00:00-03:00',
      '2018-08-14T14:00:00-03:00'
    ]);
    const now = moment('2018-08-14').tz(timezone).hours(hour).startOf('hour');
    const events = new Map<string,Set<string>>();
    events.set('2018-08-14', taken);
    const minHour = { hour: 7, timezone: 'America/Sao_Paulo' };;
    const maxHour = { hour: 22, timezone: 'America/Sao_Paulo' };
    const nextTime = nextAvailableTime(events, minHour, maxHour, now);
    expect(taken.has(nextTime.format())).toBeFalsy();
    expect(taken.has(nextTime.clone().subtract(1, 'h').format())).toBeTruthy();
    expect(taken.has(nextTime.clone().add(1, 'h').format())).toBeTruthy();
  });

  test('Should return next available weekday moment >= minHour and < maxHour', () => {
    const { hour, timezone } = { hour: 20, timezone: 'America/Sao_Paulo'};
    const taken = new Set<string>([
      '2018-08-17T19:00:00-03:00',
      '2018-08-17T20:00:00-03:00',
      '2018-08-17T21:00:00-03:00'
    ]);
    const now = moment('2018-08-17').tz(timezone).hours(hour).startOf('hour');
    const events = new Map<string,Set<string>>();
    events.set('2018-08-17', taken);
    const minHour = { hour: 7, timezone: 'America/Sao_Paulo' };;
    const maxHour = { hour: 22, timezone: 'America/Sao_Paulo' };
    const nextTime = nextAvailableTime(events, minHour, maxHour, now);
    expect(nextTime.isSameOrAfter('2018-08-20T07:00:00-03:00')).toBeTruthy();
    expect(nextTime.isBefore('2018-08-20T22:00:00-03:00')).toBeTruthy();
    expect(taken.has(nextTime.format())).toBeFalsy();
  })

});