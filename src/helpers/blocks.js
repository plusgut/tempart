import typeDom from '../types/dom';
import typeEach from '../types/each';
import typeIf from '../types/if';
import typeLog from '../types/log';
import typePartial from '../types/partial';
import typeText from '../types/text';
import typeVariable from '../types/variable';
import typeView from '../types/view';

const types = {
  dom: typeDom,
  each: typeEach,
  if: typeIf,
  log: typeLog,
  partial: typePartial,
  text: typeText,
  variable: typeVariable,
  view: typeView,
};

export default function (type) {
  if (types.hasOwnProperty(type) === false) {
    throw new Error('The type ' + type + ' is not known in the client');
  }

  return types[type];
}
