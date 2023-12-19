import root from './root';

import cal from './cal';
import csv from './cal/csv';
import ical from './cal/ical';

export default [new root(), new csv(), new ical(), new cal()];
