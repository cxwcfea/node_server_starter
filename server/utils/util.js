import _ from 'lodash';

function loadModules(o) {
  return _.mapValues(o, 'default');
}

export default {
  loadModules,
};
