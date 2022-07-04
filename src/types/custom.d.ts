/* eslint-disable no-unused-vars */

import Fetch from 'utils/fetch';
import ENV from './env';

declare global {
  interface Window {
    // [key: string]: any;
    $env: ENV;
    $fetch: Fetch;
  }
  const $env: Window['$env'];
  const $fetch: Window['$fetch'];
}
