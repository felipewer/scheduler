import calendar from '../../src/services/calendar';

describe('buildEventsMap', () => {

  const day14Events = [
    "2018-06-14T08:00:00-04:00",
    "2018-06-14T08:30:00-04:00"
  ];

  const day15Events = [
    "2018-06-15T10:00:00-04:00",
    "2018-06-15T11:00:00-04:00"
  ];

  const rawItems = [
    { start: { dateTime: '2018-06-14T09:00:00-03:00'} },
    { start: { dateTime: '2018-06-14T09:30:00-03:00'} },
    { start: { dateTime: '2018-06-15T11:00:00-03:00'} },
    { start: { dateTime: '2018-06-15T12:00:00-03:00'} },
  ];

  test('Should build empty map', () => {
    const eventMap = calendar.buildEventsMap([], 'America/Sao_Paulo');
    expect(eventMap.size).toBe(0);
  })

  test('Should map events for 2 distinct days', () => {
    const eventMap = calendar.buildEventsMap(
      rawItems,
      'America/Sao_Paulo',
      'America/Manaus'
    );
    expect(eventMap.has('2018-06-14')).toBeTruthy();
    expect(Array.from(eventMap.get('2018-06-14'))).toEqual(day14Events);
    expect(eventMap.has('2018-06-15')).toBeTruthy();
    expect(Array.from(eventMap.get('2018-06-15'))).toEqual(day15Events);
  })
})