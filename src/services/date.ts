import { Moment } from 'moment';
import moment from 'moment';
import { EventMap } from './calendar';

export const isWeekday = (date: Moment) => (
  date.day() !== 0 && date.day() !== 6
);

const inRange = (dateTime: Moment, minHour: string, maxHour: string) => {
  const lowerBound = moment(`${dateTime.format('YYYY-MM-DD')}T${minHour}`);
  const upperBound = moment(`${dateTime.format('YYYY-MM-DD')}T${maxHour}`);
  return dateTime.isBetween(lowerBound, upperBound, null, '(]')
}


export const lowerBound = (dateTime: Moment, minHour: string) => (
  moment(`${dateTime.format('YYYY-MM-DD')}T${minHour}`)
)

const upperBound = (dateTime: Moment, maxHour: string) => (
  moment(`${dateTime.format('YYYY-MM-DD')}T${maxHour}`)
)


export const nextAvailableTime = (
  events: EventMap,
  minHour: string,
  maxHour: string,
  now = moment()
): Moment => {
  // Must be at least 4 hours in the future
  let nextTime = now.clone().minutes(0).add(4, 'h');
  // Must be a weekday and after the minimum hour
  if (!isWeekday(nextTime)){
    do {
      nextTime.add(1, 'day');
      nextTime = lowerBound(nextTime, minHour);
    } while (!isWeekday(nextTime))
  } else {
    // Must be between minimum and maximum hours
    nextTime = moment.max(nextTime, lowerBound(nextTime, minHour));
    if (nextTime.isAfter(upperBound(nextTime, maxHour))) {
      do {
        nextTime.add(1, 'day');
        nextTime = lowerBound(nextTime, minHour);
      } while (!isWeekday(nextTime))
    }
  }
  // Must not already be taken
  const dateEvents = new Set(events.get(nextTime.format('YYYY-MM-DD')));
  while(dateEvents.has(nextTime.format())) {
    nextTime.add(1, 'hour');
    if (!nextTime.isBefore(upperBound(nextTime, maxHour))) {
      nextTime = lowerBound(nextTime, minHour);
    }
  }

  return nextTime;
}