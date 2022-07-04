import Fetch from 'utils/fetch';

const test = {
  REACT_APP_TEST: 'test',
};

const options = {
  $env: { ...process.env, ...test },
  $fetch: new Fetch(),
};

Object.assign(window, options);
