import dayjsLibrary from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjsLibrary.extend(utc);
dayjsLibrary.extend(timezone);
dayjsLibrary.extend(relativeTime);


export const dayjs = dayjsLibrary;
