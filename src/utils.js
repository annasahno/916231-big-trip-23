import dayjs from 'dayjs';

const DAY_MONTH_FORMAT = 'MMM D';
const HOUR_MINUTE_FORMAT = 'HH:mm';
const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';
const NUMBER_HOURS_IN_DAY = 24;
const NUMBER_MINUTES_IN_HOUR = 60;


const convertToDayOfMonth = (date) => date ? dayjs(date).format(DAY_MONTH_FORMAT) : '';

const convertToHourMinute = (date) => date ? dayjs(date).format(HOUR_MINUTE_FORMAT) : '';

const convertToDateTime = (date) => date ? dayjs(date).format(DATE_TIME_FORMAT) : '';

const getEventDuration = (dateFrom, dateTo) => {
  const durationDays = dayjs(dateTo).diff(dateFrom, 'd');
  const durationHours = dayjs(dateTo).diff(dateFrom, 'h') % NUMBER_HOURS_IN_DAY;
  const durationMinutes = dayjs(dateTo).diff(dateFrom, 'm') % NUMBER_MINUTES_IN_HOUR;

  let duration = '';
  duration += durationDays ? `${durationDays}D ` : '';
  duration += durationHours ? `${durationHours}H ` : '';
  duration += `${durationMinutes}M`;

  return duration;
};

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export {convertToDayOfMonth, convertToHourMinute, convertToDateTime, getEventDuration, getRandomArrayElement, getRandomInteger};