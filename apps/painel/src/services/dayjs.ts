import _dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

_dayjs.locale('pt-br');
_dayjs.extend(relativeTime);
_dayjs.extend(customParseFormat);

export const dayjs = _dayjs;
