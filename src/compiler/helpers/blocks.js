import typeDom from '../types/dom';
import typeEach from '../types/each';
import typeEcho from '../types/echo';
import typeIf from '../types/if';
import typeLog from '../types/log';
import typePartial from '../types/partial';
import typeView from '../types/view';

const types = {
  dom: typeDom,
  each: typeEach,
  echo: typeEcho,
  if: typeIf,
  log: typeLog,
  partial: typePartial,
  view: typeView,
};

export function all() {
  return types;
}

export function single() {

}
