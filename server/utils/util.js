import _ from 'lodash';

const mongooseHidden = require('mongoose-hidden')();

function timestampToMilSecond(v) {
  return v ? v.getTime() : v;
}

function setSchemaDefault(schema) {
  schema.set('toJSON', {
    virtuals: true,
    getters: true,
  });
  schema.set('timestamps', true);
  schema.path('createdAt').get(timestampToMilSecond);
  schema.path('updatedAt').get(timestampToMilSecond);
  schema.plugin(mongooseHidden);
}

function loadModules(o) {
  return _.mapValues(o, 'default');
}

export default {
  setSchemaDefault,
  loadModules,
};
