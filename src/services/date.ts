import { Moment } from 'moment-timezone';
import moment from 'moment-timezone';
import { EventMap } from './calendar';

export interface Hour {
  hour: number,
  timezone: string
}

export const isWeekday = (date: Moment) => (
  date.day() !== 0 && date.day() !== 6
);

export const getMomentAt = (
  { hour, timezone }: Hour,
  baseDate = moment()
) => (
  baseDate.clone().tz(timezone).hours(hour).startOf('hour')
)

export const nextAvailableTime = (
  events: EventMap,
  minHour: Hour,
  maxHour: Hour,
  now = moment()
): Moment => {
  // Must be at least 4 hours in the future
  let nextTime = now.clone().minutes(0).add(4, 'h');
  // Must be a weekday and after the minimum hour
  if (!isWeekday(nextTime)){
    do {
      nextTime.add(1, 'day');
      nextTime = getMomentAt(minHour, nextTime);
    } while (!isWeekday(nextTime))
  } else {
    // Must be between minimum and maximum hours
    nextTime = moment.max(nextTime, getMomentAt(minHour, nextTime));
    if (nextTime.isAfter(getMomentAt(maxHour, nextTime))) {
      do {
        nextTime.add(1, 'day');
        nextTime = getMomentAt(minHour, nextTime);
      } while (!isWeekday(nextTime))
    }
  }
  // Must not already be taken
  const dateEvents = new Set(events.get(nextTime.format('YYYY-MM-DD')));
  while(dateEvents.has(nextTime.format())) {
    nextTime.add(1, 'hour');
    if (!nextTime.isBefore(getMomentAt(maxHour, nextTime))) {
        nextTime.add(1, 'day');
        nextTime = getMomentAt(minHour, nextTime);
    }
  }

  return nextTime;
}