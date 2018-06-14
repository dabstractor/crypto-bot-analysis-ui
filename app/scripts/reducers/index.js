import app from './app';
import github from './github';
import user from './user';
import chart from './chart';

export default {
  ...app,
  ...github,
  ...user,
  ...chart,
};
