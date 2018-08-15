import moment from "moment-timezone";
import { getMomentAt } from '../../src/services/date';


describe('Get moment at specific date, hour and timezone', () => {

  test('Should return moment at 6AM America/Manaus', () => {
    const dateTime = getMomentAt(6, 'America/Manaus');
    expect(dateTime.hours()).toBe(6);
    expect(dateTime.tz()).toBe('America/Manaus');
  });

  test('Should return moment at 7AM America/Sao_Paulo', () => {
    const dateTime = getMomentAt(7, 'America/Sao_Paulo');
    expect(dateTime.hours()).toBe(7);
    expect(dateTime.tz()).toBe('America/Sao_Paulo');
  });

  test('Should return moment on August 14, 2018', () => {
    const dateTime = getMomentAt(7, 'America/Sao_Paulo', moment('2018-08-14'));
    expect(dateTime.format()).toBe('2018-08-14T07:00:00-03:00');

  });

  test('Should be at the same hour', () => {
    const date = moment();
    const manaus6AM = getMomentAt(6, 'America/Manaus', date);
    const saoPaulo7AM = getMomentAt(7, 'America/Sao_Paulo', date);
    expect(manaus6AM.isSame(saoPaulo7AM, 'hour')).toBeTruthy();
    expect(manaus6AM.unix()).toEqual(saoPaulo7AM.unix());
  });

});

describe('Get next available time', () => {

  test('Should return a moment 4 hours in the future', () => {
    const now = moment('2018-08-14').tz('America/Sao_Paulo').startOf('day');
    const nextTime = now.clone().add(4, 'hours');
    expect(nextTime.diff(now, 'hours')).toBe(4);
  });

  test('Should return a moment >= the minimum hour', () => {
    const { hour, timezone } = { hour: 7, timezone: 'America/Sao_Paulo'};
    const now = moment('2018-08-14').tz(timezone).startOf('day');
    const nextTime = now.clone().add(hour, 'hours');
    expect(nextTime.isSameOrAfter('2018-08-14T07:00:00-03:00')).toBeTruthy();
  });

  test('Should return a moment < the maximum hour', () => {
    const { hour, timezone } = { hour: 22, timezone: 'America/Sao_Paulo'};
    const now = moment('2018-08-14').tz(timezone).startOf('day');
    const nextTime = now.clone().add(hour - 1, 'hours');
    expect(nextTime.isBefore('2018-08-14T22:00:00-03:00')).toBeTruthy();
  });

  test('Should return a moment >= the minimum hour on the next weekday', () => {
    const { hour, timezone } = { hour: 7, timezone: 'America/Sao_Paulo'};
    const now = moment('2018-08-18').tz(timezone).startOf('day');
    const nextTime = now.clone().add(2, 'days').add(hour, 'hours');
    expect(nextTime.isSameOrAfter('2018-08-20T07:00:00-03:00')).toBeTruthy();
  });

  test('Should return a moment < the maximum hour on the next weekday', () => {
    const { hour, timezone } = { hour: 22, timezone: 'America/Sao_Paulo'};
    const now = moment('2018-08-17').tz(timezone).startOf('day');
    const nextTime = now.clone().add(3, 'days').add(hour - 1, 'hours');
    expect(nextTime.isBefore('2018-08-20T22:00:00-03:00')).toBeTruthy();
  });

  test('Should return a moment not already taken', () => {
    const { hour, timezone } = { hour: 7, timezone: 'America/Sao_Paulo'};
    const taken = new Set<string>([
      '2018-08-14T07:00:00-03:00',
      '2018-08-14T08:00:00-03:00',
      '2018-08-14T10:00:00-03:00'
    ]);
    const now = moment('2018-08-14').tz(timezone).hours(hour).startOf('hour');
    const nextTime = now.clone().add(2, 'hours');
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
    const nextTime = now.clone().add(3, 'days');
    expect(nextTime.isSameOrAfter('2018-08-20T07:00:00-03:00')).toBeTruthy();
    expect(nextTime.isBefore('2018-08-20T22:00:00-03:00')).toBeTruthy();
    expect(taken.has(nextTime.format())).toBeFalsy();
  })

});