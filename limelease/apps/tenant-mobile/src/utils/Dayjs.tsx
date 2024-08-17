import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// @ts-ignore
Date.prototype._toLocaleString = Date.prototype.toLocaleString;
// @ts-ignore
Date.prototype.toLocaleString = function (a, b) {
  if (b && Object.keys(b).length === 1 && 'timeZone' in b && a === 'en-US') {
    return Intl.DateTimeFormat('en-us', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: b.timeZone,
    })
      .format(this)
      .replace(/(\d{2})\/(\d{2})\/(\d{4}),/g, '$3-$1-$2');
  }
  // @ts-ignore
  return this._toLocaleString(a, b);
};

export default dayjs;
